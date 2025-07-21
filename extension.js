const vscode = require('vscode');

let mode = 'stopwatch'; // 'stopwatch' or 'pomodoro'
let pomodoroDuration = 1200; // Pomodoro timer in seconds (multiplied by 10)
let pomodoroTime = 1200; // Current pomodoro time remaining (multiplied by 10)
let stopwatchTime = 0; // Stopwatch timer in seconds (multiplied by 10)
let sessionStartTime;
let sessionInterval;
let getContext;

// Current task tracking
let currentPomodoroTask = '';
let currentStopwatchTask = '';

// Independent states for each mode
let stopwatchState = {
	timerRunning: false,
	interval: null,
};

let pomodoroState = {
	timerRunning: false,
	interval: null,
};

let statusBarItems = {}; // Holds the status bar items

let analyticsPanel;
let dashboardPanel;

// Maintain Historical Data
const storeHistory = (/** @type {string} */ mode, /** @type {string} */ elapsedSeconds) => {
	const historyKey =
		mode === "stopwatch"
			? "stopwatchHistory"
			: mode === "pomodoro"
				? "pomodoroHistory"
				: "sessionHistory";

	const existingHistory = JSON.parse(getContext.globalState.get(historyKey) || "[]");
	const newEntry = {
		id: Date.now(),
		mode,
		elapsedSeconds,
		timestamp: new Date().toISOString(),
	};
	getContext.globalState.update(historyKey, JSON.stringify([...existingHistory, newEntry]));
};

// Helper function to format time in hh:mm:ss
/**
 * @param {number} seconds
 */
function formatTime(seconds) {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	return `${String(hrs).padStart(2, '0')} : ${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
}

// Update the status bar with the proper text
function updateStatusBar() {
	if (!statusBarItems || Object.keys(statusBarItems).length === 0) {
		vscode.window.showErrorMessage('Status bar items are not initialized.');
		return;
	}

	// Update session elapsed time
	const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
	statusBarItems.session.text = `Session ⏳ ${elapsedSeconds > 0 ? formatTime(elapsedSeconds) : "starting..."}`;
	statusBarItems.session.tooltip = 'Elapsed time since the session started';

	if (mode === 'pomodoro') {
		const pomodoroTimeFormatted = formatTime(pomodoroTime / 10);
		const { timerRunning } = pomodoroState;

		statusBarItems.mode.text = `⏰`;
		statusBarItems.mode.tooltip = 'Switch to Stopwatch mode'; // Tooltip
		statusBarItems.mode.command = 'timeCoder.toggleMode';

		statusBarItems.time.text = `${pomodoroTime === 0 ? 'Pomodoro' : pomodoroTimeFormatted}`;
		statusBarItems.time.tooltip = `${pomodoroTime === 0 ? 'TimeCoder by DjArtimus' : 'Remaining time for the Pomodoro timer'}`; // Tooltip
		statusBarItems.time.command = 'timeCoder.openWebview';

		statusBarItems.toggle.text = timerRunning ? `⏸` : `▶`;
		statusBarItems.toggle.tooltip = timerRunning ? 'Pause the Pomodoro timer' : 'Start the Pomodoro timer'; // Tooltip
		statusBarItems.toggle.command = 'timeCoder.toggleTimer';

		statusBarItems.reset.text = `🔄`;
		statusBarItems.reset.tooltip = 'Reset the Pomodoro timer'; // Tooltip
		statusBarItems.reset.command = 'timeCoder.resetTimer';

		statusBarItems.decrease.text = `⏬`;
		statusBarItems.decrease.tooltip = 'Decrease the Pomodoro timer duration'; // Tooltip
		statusBarItems.decrease.command = 'timeCoder.adjustPomodoroTimeDecrease';

		statusBarItems.increase.text = `⏫`;
		statusBarItems.increase.tooltip = 'Increase the Pomodoro timer duration'; // Tooltip
		statusBarItems.increase.command = 'timeCoder.adjustPomodoroTimeIncrease';
	} else {
		const stopwatchTimeFormatted = formatTime(stopwatchTime / 10);
		const { timerRunning } = stopwatchState;

		statusBarItems.mode.text = `⏱`;
		statusBarItems.mode.tooltip = 'Switch to Pomodoro mode'; // Tooltip
		statusBarItems.mode.command = 'timeCoder.toggleMode';

		statusBarItems.time.text = `${stopwatchTime === 0 ? 'StopWatch' : stopwatchTimeFormatted}`;
		statusBarItems.time.tooltip = `${stopwatchTime === 0 ? 'TimeCoder by DjArtimus' : 'Elapsed time for current task'}`; // Tooltip
		statusBarItems.time.command = 'timeCoder.openWebview';

		statusBarItems.toggle.text = timerRunning ? `⏸` : `▶`;
		statusBarItems.toggle.tooltip = timerRunning ? 'Pause the stopwatch' : 'Start the stopwatch'; // Tooltip
		statusBarItems.toggle.command = 'timeCoder.toggleTimer';

		statusBarItems.reset.text = `🔄`;
		statusBarItems.reset.tooltip = 'Reset the stopwatch'; // Tooltip
		statusBarItems.reset.command = 'timeCoder.resetTimer';

		statusBarItems.increase.text = ``;
		statusBarItems.decrease.text = ``;
	}

	for (const item in statusBarItems) {
		statusBarItems[item].show();
	}
}

function startSessionTimer() {
	sessionInterval = setInterval(() => {
		updateStatusBar();
	}, 500);
}

// Prompt user for task description
async function promptForTask(mode) {
	const task = await vscode.window.showInputBox({
		prompt: `What task are you working on in ${mode} mode?`,
		placeHolder: 'Enter task description...',
		value: mode === 'pomodoro' ? currentPomodoroTask : currentStopwatchTask
	});
	
	if (task !== undefined) { // User didn't cancel
		if (mode === 'pomodoro') {
			currentPomodoroTask = task;
		} else {
			currentStopwatchTask = task;
		}
		return task;
	}
	return null; // User cancelled
}

// Toggle the timer (start/stop)
async function toggleTimer() {
	if (mode === 'stopwatch') {
		const state = stopwatchState;
		// Increment Stopwatch count
		if (state.timerRunning) {
			clearInterval(state.interval);
		} else {
			// Prompt for task when starting
			const task = await promptForTask('stopwatch');
			if (task === null) return; // User cancelled, don't start timer
			
			state.interval = setInterval(() => {
				stopwatchTime++;
				updateStatusBar();
			}, 100);
		}
		state.timerRunning = !state.timerRunning;
	} else if (mode === 'pomodoro') {
		const state = pomodoroState;
		if (pomodoroTime / 100 > 0) {
			if (state.timerRunning) {
				clearInterval(state.interval);
			} else {
				// Prompt for task when starting
				const task = await promptForTask('pomodoro');
				if (task === null) return; // User cancelled, don't start timer
				
				state.interval = setInterval(() => {
					if (pomodoroTime / 100 > 0) {
						pomodoroTime--;
						updateStatusBar();
					} else {
						clearInterval(state.interval);
						state.timerRunning = false;
						updateStatusBar();
						vscode.window.showInformationMessage('Pomodoro timer completed! Restart?', { modal: true }, 'OK').then((selection) => {
							if (selection === 'OK') {
								pomodoroTime = pomodoroDuration;
								toggleTimer();
							}
						});
					}
				}, 100);
			}
			state.timerRunning = !state.timerRunning;
		} else {
			vscode.window.showErrorMessage('Pomodoro time not set!');
		}
	}
	updateStatusBar();
}

// Reset the timer
function resetTimer() {
	if (mode === 'stopwatch') {
		const elapsed = formatTime(stopwatchTime / 10); // Elapsed time
		storeHistory("stopwatch", elapsed);
		stopwatchTime = 0;
		currentStopwatchTask = ''; // Clear task
		clearInterval(stopwatchState.interval);
		stopwatchState.timerRunning = false;
	} else if (mode === 'pomodoro') {
		const remaining = formatTime((pomodoroDuration - pomodoroTime) / 10);
		storeHistory("pomodoro", remaining);
		pomodoroTime = pomodoroDuration;
		currentPomodoroTask = ''; // Clear task
		clearInterval(pomodoroState.interval);
		pomodoroState.timerRunning = false;
	} else if (mode === 'session') {
		const elapsed = formatTime(Math.floor((Date.now() - sessionStartTime) / 1000));
		storeHistory("session", elapsed);
		sessionStartTime = Date.now();
	}
	updateStatusBar();
}

// Adjust Pomodoro time (increase or decrease)
/**
 * @param {boolean} increase
 */
function adjustPomodoroTime(increase, mins = 1) {
	if (increase) { pomodoroTime += mins * 600; pomodoroDuration += mins * 600; }
	else { if (pomodoroTime > 0 && pomodoroTime > mins * 580) { pomodoroTime -= mins * 600; pomodoroDuration -= mins * 600; } else { vscode.window.showErrorMessage('Pomodoro time not sufficient to decrease!') } }
	updateStatusBar();
}

// Switch between Stopwatch and Pomodoro modes
function toggleMode() {
	mode === 'stopwatch' ? mode = 'pomodoro' : mode = 'stopwatch';
	updateStatusBar();
}



/**
 * @param {vscode.WebviewPanel | vscode.WebviewView} webviewPanel
 */
function Communicator(webviewPanel) {

	webviewPanel.webview.onDidReceiveMessage(
		(/** @type {{ command: any; }} */ message) => {
			const command = message.command
			switch (command) {
				case 'start-stop-Stopwatch':
					mode = 'stopwatch';
					toggleTimer(); // Reuse existing function
					break;
				case 'resetStopwatch':
					mode = 'stopwatch';
					resetTimer();
					break;
				case 'start-stop-Pomodoro':
					mode = 'pomodoro';
					toggleTimer();
					break;
				case 'resetPomodoro':
					mode = 'pomodoro';
					resetTimer();
					break;
				case 'adjustPomodoroIncrease':
					mode = 'pomodoro';
					adjustPomodoroTime(true);
					break;
				case 'adjustPomodoroDecrease':
					mode = 'pomodoro';
					adjustPomodoroTime(false);
					break;
				case 'resetSession':
					mode = 'session';
					resetTimer();
					break;
				case 'saveSession':
					vscode.window.showInformationMessage('Session saved!');
					break;
				default:
					const adjustTimer = (/** @type {boolean} */ operation) => adjustPomodoroTime(operation, Number(command.split("_")[1]))
					if (command.includes("adjustPomodoro")) {
						command.includes("adjustPomodoroIncrease") ? adjustTimer(true) : adjustTimer(false);
					} else {
						vscode.window.showErrorMessage('Unknown command');
					}
			}
		},
		null,
		[]
	);

	const updateTimersInWebview = () => {
		const stopwatch = { 
			timmerRunning: stopwatchState.timerRunning, 
			time: formatTime(stopwatchTime / 10),
			task: currentStopwatchTask
		};
		const pomodorofracRemaining = Math.floor(pomodoroTime / 10) / Math.floor(pomodoroDuration / 10);
		const pomodoro = { 
			timmerRunning: pomodoroState.timerRunning, 
			time: formatTime(pomodoroTime / 10),
			fracRemaining: pomodorofracRemaining,
			task: currentPomodoroTask
		}
		const statusBarData = {
			mode,
			stopwatch,
			pomodoro,
			sessionElapsed: formatTime(Math.floor((Date.now() - sessionStartTime) / 1000)),
		};
		webviewPanel && webviewPanel.webview.postMessage({ command: 'updateTimers', data: statusBarData });
	};
	setInterval(updateTimersInWebview, 100);
}


// Open the WebView
const { generateWebviewHtml } = require('./webviewContent.js');


function openWebview() {
	if (dashboardPanel) {
		dashboardPanel.reveal(vscode.ViewColumn.One);
	} else {

		dashboardPanel = vscode.window.createWebviewPanel(
			'timeCoderWebview',
			'TimeCoder - Dashboard',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [],
			}
		);
		dashboardPanel.webview.html = generateWebviewHtml();

		dashboardPanel.onDidDispose(
			() => {
				dashboardPanel = undefined;
			},
			undefined,
			getContext.subscriptions
		);

		Communicator(dashboardPanel);

	}

};


const { generateAnalyticsHtml } = require('./analyticsWebview.js');


function openAnalyticsWebview() {

	// Check if the panel is already open
	if (analyticsPanel) {
		analyticsPanel.reveal(vscode.ViewColumn.One);
		return;
	}
	analyticsPanel = vscode.window.createWebviewPanel(
		'timeCoderAnalytics',
		'TimeCoder - Analytics',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);
	analyticsPanel.webview.html = generateAnalyticsHtml(getContext);
	// Handle when the webview is closed
	analyticsPanel.onDidDispose(() => {
		analyticsPanel = null;
	});
}

const { getSidePanelHtmlContent } = require("./sidePanelContent.js")

class TimeCoderSidePanelProvider {
	/**
	 * @param {vscode.Uri} extensionUri
	 */
	constructor(extensionUri) {
		this.extensionUri = extensionUri;
	}

	/**
	 * @param {vscode.WebviewView} webviewView
	 */
	resolveWebviewView(webviewView) {
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "media")],
		};

		// Set HTML content for the webview
		webviewView.webview.html = getSidePanelHtmlContent();

		Communicator(webviewView);
	}

	/**
	 * Generates HTML content for the webview
	 * @returns {string} HTML content
	 */

}


// Activate the extension
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	getContext = context;

	sessionStartTime = Date.now();

	statusBarItems.session = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100000);
	statusBarItems.mode = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
	statusBarItems.time = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 999);
	statusBarItems.toggle = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 998);
	statusBarItems.reset = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 997);
	statusBarItems.decrease = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 996);
	statusBarItems.increase = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 995);

	console.log('Activating extension...');
	updateStatusBar(); // Check if this runs multiple times
	console.log('Status bar updated.');
	startSessionTimer();

	context.subscriptions.push(
		vscode.commands.registerCommand('timeCoder.startSessionTimer', startSessionTimer),
		vscode.commands.registerCommand('timeCoder.toggleTimer', toggleTimer),
		vscode.commands.registerCommand('timeCoder.resetTimer', resetTimer),
		vscode.commands.registerCommand('timeCoder.adjustPomodoroTimeIncrease', () => adjustPomodoroTime(true)),
		vscode.commands.registerCommand('timeCoder.adjustPomodoroTimeDecrease', () => adjustPomodoroTime(false)),
		vscode.commands.registerCommand('timeCoder.toggleMode', toggleMode),
		vscode.commands.registerCommand('timeCoder.openWebview', openWebview),
		vscode.commands.registerCommand('timeCoder.openAnalytics', openAnalyticsWebview),
		vscode.window.registerWebviewViewProvider("timeCoderSidePanel", new TimeCoderSidePanelProvider(context.extensionUri))
		// vscode.window.registerTreeDataProvider('timeCoderView', new TimeCoderTreeDataProvider()),
		// vscode.window.registerTreeDataProvider("timeCoderView", new EnhancedTreeDataProvider())

	);

	// vscode.window.showInformationMessage('TimeCoder is ready!');
}

// Deactivate the extension
function deactivate() {
	clearInterval(stopwatchState.interval);
	clearInterval(pomodoroState.interval);
	clearInterval(sessionInterval);
}

module.exports = {
	activate,
	deactivate,
};
