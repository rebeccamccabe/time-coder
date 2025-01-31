/**
* Generates HTML for the Timer Modes (Stopwatch, Pomodoro, Session Tracker) Webview.
* @returns {string} HTML content
*/
function generateWebviewHtml() {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TimeCoder</title>
    <style>
        :root {
            color-scheme: light dark;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }

        .container {
            padding: 10px;
        }

        .tabs {
            display: flex;
            border-bottom: 1px solid var(--vscode-statusBar-border);
        }

        .tab {
            flex: 1;
            font-size: large;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            background-color: var(--vscode-statusBar-background);
            color: var(--vscode-statusBar-noFolderForeground);
            border-right: 1px solid var(--vscode-statusBar-border);
        }

        .tab.active {
            background-color: var(--vscode-tab-activeBackground);
            color: var(--vscode-tab-activeForeground);
            border-radius: 8px;
            border: 1px solid;
        }

        .content {
            display: none;
            padding: 20px;
        }

        .content.active {
            display: block;
        }

        button {
            width: 80px;
            padding: 10px;
            padding-top: 11.5px;
            font-size: medium;
            margin: 5px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            cursor: pointer;
            border-radius: 8px;
        }

        button:hover {
            background-color: var(--vscode-button-hoverBackground);
            scale: 1.1;
            transition: all 250ms;
        }

        button:active {
            scale: 0.98;
            transition: all 250ms;
        }

        .buttons-bar {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        .timer-display {
            font-size: 6rem;
            text-align: center;
            margin-top: 30px;
            margin-bottom: 50px;
        }

        .taskInput {
            background-color: var(--vscode-editor-background);
            padding: 10px;
            padding-top: 11.5px;
            font-size: medium;
            margin: 5px;
            color: var(--vscode-button-foreground);
            cursor: pointer;
            border-radius: 8px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="tabs">
            <div class="tab active" id="stopwatch-tab">Stopwatch</div>
            <div class="tab" id="pomodoro-tab">Pomodoro</div>
            <div class="tab" id="session-tracker-tab">Session Tracker</div>
        </div>
        <div id="stopwatch-content" class="content active">
            <div class="timer-display" id="stopwatch-display">00:00:00</div>
            <div class="buttons-bar">
                <button id="start-stop-Stopwatch" onclick="postMessage('start-stop-Stopwatch')">Start</button>
                <button onclick="postMessage('resetStopwatch')">Reset</button>
            </div>
        </div>
        <div id="pomodoro-content" class="content">
            <div class="timer-display" id="pomodoro-display">00:02:00</div>
            <div class="buttons-bar">
                <button onclick="postMessage('adjustPomodoroDecrease')">-1 Min</button>
                <button onclick="postMessage('resetPomodoro')">Reset</button>
                <button id="start-stop-Pomodoro" onclick="postMessage('start-stop-Pomodoro')">Start</button>
                <button onclick="postMessage('adjustPomodoroIncrease')">+1 Min</button>
            </div>
        </div>
        <div id="session-tracker-content" class="content">
            <div class="timer-display" id="session-display">00:00:00</div>
            <div class="buttons-bar">
                <button onclick="postMessage('resetSession')">Reset</button>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        const postMessage = (command) => {
            vscode.postMessage({ command });
        }

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.id.replace('-tab', '-content')).classList.add('active');
            });
        });

        function activateTab(tabId) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
            const tab = tabId + "-tab";
            const content = tabId + "-content";
            document.getElementById(tab).classList.add('active');
            document.getElementById(content).classList.add('active');
        }

        // Handle the message inside the webview
        window.addEventListener('message', event => {
            const { command, data } = event.data;

            if (command === 'updateTimers') {
                const { mode, stopwatch, pomodoro, sessionElapsed } = data;
                document.getElementById('stopwatch-display').textContent = stopwatch.time;
                document.getElementById('start-stop-Stopwatch').textContent = stopwatch.timmerRunning ? "Pause" : "Start";
                document.getElementById('pomodoro-display').textContent = pomodoro.time;
                document.getElementById('start-stop-Pomodoro').textContent = pomodoro.timmerRunning ? "Pause" : "Start";
                document.getElementById('session-display').textContent = sessionElapsed;
            }
        });
    </script>
</body>

</html>`;
}

module.exports = { generateWebviewHtml };