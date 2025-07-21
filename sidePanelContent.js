function getSidePanelHtmlContent() {
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

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: sans-serif;
            display: flex;
            position: relative;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100vh;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .timeCoder-section {
            height: 100%;
            min-height: 250px;
        }

        main {
            display: flex;
            flex-direction: column;
            gap: 30px;
            align-items: center;
            justify-content: space-around;
            padding-top: 5%;
            height: 80%;
        }

        .tab-container {
            height: 4vh;
            display: flex;
            gap: 1.6vw;
            justify-content: center;
            align-items: center;
        }

        .tab {
            display: flex;
            align-items: center;
            margin-bottom: 0.1vh;
            border: 1px solid gray;
            border-radius: 4vw;
            cursor: pointer;
            transition: all 0.5s;
        }

        .tab.active {
            border: none;
            cursor: auto;
        }

        .tab h1 {
            opacity: 1;
            font-size: 9.2vw;
            transform: scaleX(1);
            transform-origin: left;
            transition: transform 0.3s, opacity 0.3s;
        }

        .tab h1.line2 {
            transition: transform 0.3s 0.3s, opacity 0.3s 0.3s;
        }

        .tab h1.hidden {
            opacity: 0;
            transform: scaleX(0);
            transform-origin: left;
            transition-duration: 0ms;
            width: 0;
        }

        .tab h1.hidden.line2 {
            transition: transform 0ms 0ms, opacity 0ms 0ms;
        }

        .tab span {
            transition: transform 0.3s, opacity 0.3s;
        }

        /* Pomodoro Tab Styles */
        #pomodoro-tab span {
            font-size: 8vw;
            padding: 0.8vw 0.6vw 2vw;
            transition-duration: 0.3s;
        }

        #pomodoro-tab.active span {
            font-size: 6vw;
            padding: 0;
        }

        /* Stopwatch Tab Styles */
        #stopwatch-tab span {
            font-size: 8vw;
            margin: 0.3vw 1.2vw 1.9vw;
            transition-duration: 0.3s;
        }

        #stopwatch-tab.active span {
            font-size: 6vw;
            margin: 0 0;
        }

        /* Session Tab Styles */
        #session-tab span {
            font-size: 8vw;
            margin: 0.7vw 1.8vw 1.6vw;
            transition-duration: 0.3s;
        }

        #session-tab.active span {
            font-size: 5.5vw;
            margin: 0.2vh 0 0;
        }

        .timers {
            position: relative;
            width: 100%;
            height: 50vh;
            min-height: 160px;
            max-height: 170px;
        }

        .timer.active {
            opacity: 1;
        }

        .timer {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            font-size: 20vw;
            font-weight: bold;
            z-index: 10;
        }

        .pomodoro-visual-timer {
            position: absolute;
            left: 50%;
            top: 20%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            opacity: 0;
            pointer-events: none;
            z-index: 1;
        }

        .pomodoro-visual-timer.active {
            opacity: 1;
        }

        .circular-progress {
            width: 100%;
            height: 100%;
        }

        .progress-bg {
            fill: none;
            stroke: var(--vscode-editor-foreground);
            stroke-width: 4;
            opacity: 0.2;
        }

        .progress-bar {
            fill: var(--vscode-button-background);
            stroke: none;
            transition: d 1s ease;
        }

        .controls {
            position: relative;
            bottom: 0;
            width: 110%;
            height: 100%;
            transform: translateY(85%);
        }

        .control-buttons.active {
            z-index: 20;
            opacity: 1;
            pointer-events: all;
        }

        .control-buttons {
            position: absolute;
            width: 110%;
            margin-left: -5%;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 3vw;
            pointer-events: none;
            z-index: 20;
        }

        .control-buttons button {
            width: 20vw;
            padding: 2vw 0;
            border: 1px solid white;
            border-radius: 4vw;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-size: 4vw;
            cursor: pointer;
            transition: transform, opacity 0.3s;
        }

        .control-buttons button:hover {
            background-color: var(--vscode-button-hoverBackground);
            transform: scale(1.05);
        }

        .control-buttons button:active {
            transform: scale(0.95);
        }

        .fortune {
            text-align: center;
            min-height: 110px;
            font-size: large;
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            width: 80%;
            z-index: 20;
        }

        footer {
            position: absolute;
            width: 100%;
            left: 50%;
            transform: translateX(-50%);
            bottom: 5%;
            font-size: 4vw;
            text-align: center;
        }

        @media (min-width: 400px) {
            .tab-container {
                height: 2rem;
                gap: 1vw;
            }

            .tab {
                padding: 2px;
                border-radius: 1rem;
            }

            .tab h1 {
                font-size: 2.3rem;
            }

            /* Responsive Pomodoro Tab Styles */
            #pomodoro-tab span {
                font-size: 2rem;
                padding: 0;
                margin: 0rem 0.03rem 0.35rem 0rem;
            }

            #pomodoro-tab.active span {
                font-size: 1.5rem;
                margin: 0.1rem 0 0;
            }

            /* Responsive Stopwatch Tab Styles */
            #stopwatch-tab span {
                font-size: 2rem;
                padding: 0;
                margin: 0.1rem 0.18rem 0.3rem 0.18rem;
            }

            #stopwatch-tab.active span {
                font-size: 1.5rem;
                margin: 0.3rem 0 0;
            }

            /* Responsive Session Tab Styles */
            #session-tab span {
                font-size: 2rem;
                padding: 0;
                margin: 0 0.3rem 0.33rem;
            }

            #session-tab.active span {
                font-size: 1.45rem;
                margin: 0.1rem -0.2rem 0;
            }

            .timers{
                min-height: 220px;
            }

            .timer {
                font-size: 5rem;
                z-index: 10;
            }

            .pomodoro-visual-timer {
                width: 180px;
                height: 180px;
                top: 35%;
                z-index: 1;
            }

            .controls {
                transform: translateY(85%);
                width: 100%;
            }

            .control-buttons{
                width: 100%;
                margin-left: 0;
                gap: 8px;
            }

            .control-buttons button {
                width: 5rem;
                padding: 0.5rem;
                margin: 3px;
                font-size: 1rem;
                border-radius: 1rem;
            }

            .fortune {
                width: 400px;
                min-height: 90px;
                font-size: larger;
            }

            footer {
                font-size: 1rem;
            }
        }
    </style>
</head>

<body>
    <section class="timeCoder-section">
        <main>
            <!-- Tab Navigation -->
            <div class="tab-container">
                <div class="tab" id="pomodoro-tab" title="Switch to Pomodoro">
                    <h1 class="hidden" id="pomodoro-line1">Pom</h1>
                    <span id="pomodoro-emoji">⏰</span>
                    <h1 class="hidden line2" id="pomodoro-line2">doro</h1>
                </div>
                <div class="tab active" id="stopwatch-tab">
                    <h1 id="stopwatch-line1">St</h1>
                    <span id="stopwatch-emoji">⏱</span>
                    <h1 class="line2" id="stopwatch-line2">pwatch</h1>
                </div>
                <div class="tab" id="session-tab" title="Switch to Session Timer">
                    <h1 class="hidden" id="session-line1">Se</h1>
                    <span id="session-emoji">⏳</span>
                    <h1 class="hidden line2" id="session-line2">sion</h1>
                </div>
            </div>

            <!-- Timers -->
            <div class="timers">
                <div id="stopwatch-display" class="timer active">00:00:00</div>
                <div id="pomodoro-display" class="timer">00:00:00</div>
                <div id="session-display" class="timer">00:00:00</div>
                
                <!-- Visual Timer for Pomodoro -->
                <div class="pomodoro-visual-timer" id="pomodoro-visual-timer">
                    <svg class="circular-progress" viewBox="0 0 200 200">
                        <circle class="progress-bg" cx="100" cy="100" r="90"></circle>
                        <path class="progress-bar" id="progress-circle"></path>
                    </svg>
                </div>


                <!-- Controls -->

                <div class="controls" id="controls">
                    <div class="control-buttons active" id="stopwatch-buttons">
                        <button class="control-btn" id="start-stop-Stopwatch">Start</button>
                        <button class="control-btn" id="resetStopwatch">Reset</button>
                    </div>
                    <div class="control-buttons" id="pomodoro-buttons">
                        <button class="control-btn" id="adjustPomodoroDecrease">-1 min</button>
                        <button class="control-btn" id="start-stop-Pomodoro">Start</button>
                        <button class="control-btn" id="resetPomodoro">Reset</button>
                        <button class="control-btn" id="adjustPomodoroIncrease">+1 min</button>
                        <button class="control-btn" id="adjustPomodoroDecrease_5">-5 min</button>
                        <button class="control-btn" id="adjustPomodoroDecrease_25">-25 min</button>
                        <button class="control-btn" id="adjustPomodoroIncrease_5">+5 min</button>
                        <button class="control-btn" id="adjustPomodoroIncrease_25">+25 min</button>
                    </div>
                    <div class="control-buttons" id="session-buttons">
                        <button class="control-btn" id="resetSession">Reset</button>
                    </div>
                </div>
            </div>
            <div class="fortune">
                <p id="fortune"></p>
                <button style="font-size: 30px; background-color: transparent; border: 0; cursor: pointer;"
                    id="fortune-teller">🔮</button>
            </div>

        </main>
        <footer>
            <div>&copy; <span id="year"></span> TimeCoder | Developed by DjArtimus 💖</div>
        </footer>
    </section>
    <script>

        const fortuneCookies = [
            "A beautiful, smart, and loving person will be coming into your life.",
            "A faithful friend is a strong defense.",
            "A fresh start will put you on your way.",
            "A friend asks only for your time, not your money.",
            "A friend is a present you give yourself.",
            "A gambler not only will lose what he has, but also will lose what he doesn’t have.",
            "A golden egg of opportunity falls into your lap this month.",
            "A good time to finish up old tasks.",
            "A hunch is creativity trying to tell you something.",
            "A lifetime of happiness lies ahead of you.",
            "A lifetime friend shall soon be made.",
            "A light heart carries you through all the hard times.",
            "A new perspective will come with the new year.",
            "A person is never too old to learn.",
            "A person of words and not deeds is like a garden full of weeds.",
            "A pleasant surprise is waiting for you.",
            "A smile is your personal welcome mat.",
            "A smooth long journey! Great expectations.",
            "Accept something that you cannot change and you will feel better.",
            "Adventure can be a real happiness.",
            "Advice, when most needed, is least heeded.",
            "All the effort you are making will ultimately pay off.",
            "All the troubles you have will pass away quickly.",
            "All your hard work will soon pay off.",
            "Allow compassion to guide your decisions.",
            "An agreeable romance might begin to take on the appearance.",
            "An important person will offer you support.",
            "An inch of time is an inch of gold.",
            "Be careful or you could fall for some tricks today.",
            "Beauty in its various forms appeals to you.",
            "Because you demand more from yourself, others respect you deeply.",
            "Believe in yourself and others will too.",
            "Believe it can be done.",
            "Better ask twice than lose yourself once.",
            "Carve your name on your heart and not on marble.",
            "Change is happening in your life, so go with the flow!",
            "Competence like yours is underrated.",
            "Congratulations! You are on your way.",
            "Courtesy begins in the home.",
            "Courtesy is contagious.",
            "Curiosity kills boredom. Nothing can kill curiosity.",
            "Dedicate yourself with a calm mind to the task at hand.",
            "Department stores are like museums.",
            "Determine your mind to think and plan ahead.",
            "Discipline is the refining fire by which talent becomes ability.",
            "Do not be intimidated by the eloquence of others.",
            "Do not demand for someone’s soul if you already got his heart.",
            "Do not let ambitions overshadow small success.",
            "Do not make extra work for yourself.",
            "Do not underestimate yourself. Human beings have unlimited potential.",
            "Don’t be discouraged, because every wrong attempt discarded is another step forward.",
            "Don’t confuse recklessness with confidence.",
            "Don’t just think, act!",
            "Don’t let friends impose on you, work calmly and silently.",
            "Don’t let your limitations overshadow your talents.",
            "Each day, compel yourself to do something you would rather not do.",
            "Education is the ability to meet life’s situations.",
            "Embrace this love relationship you have!",
            "Emulate what you admire in your parents.",
            "Encouragement after censure is the sun after a shower.",
            "Every flower blooms in its own sweet time.",
            "Every wise man started out by asking many questions.",
            "Everyday in your life is a special occasion.",
            "Failure is the chance to do better next time.",
            "Fear and desire – two sides of the same coin.",
            "Fearless courage is the foundation of victory.",
            "For hate is never conquered by hate. Hate is conquered by love.",
            "Fortune Not Found: Abort, Retry, Ignore?",
            "From listening comes wisdom and from speaking repentance.",
            "Go take a rest; you deserve it.",
            "Good news will come to you by mail.",
            "Good to begin well, better to end well.",
            "Happiness begins with facing life with a smile and a wink.",
            "Happiness will bring you good luck.",
            "Happy life is just in front of you.",
            "Hard words break no bones, fine words butter no parsnips.",
            "Have fun.",
            "He who expects no gratitude shall never be disappointed.",
            "He who knows he has enough is rich.",
            "Help! I’m a prisoner in a fortune cookie factory!",
            "How you look depends on where you go.",
            "I learn by going where I have to go.",
            "If a true sense of value is to be yours, it must come through service.",
            "If certainty were truth, we would never be wrong.",
            "If you continually give, you will continually have.",
            "If you look in the right places, you can find some good offerings.",
            "If you love someone, let them go. If they return, they were always yours. If they don’t, they never were.",
            "If you tell the truth you don’t have to remember anything.",
            "If you waste your time straining at gnats, you’ll swallow camels later.",
            "Improve your business affairs.",
            "In music, one must think with the heart and feel with the brain.",
            "In the end all things will be known.",
            "In this world of contradiction, It’s better to be merry than wise.",
            "It could be better, but it’s good enough.",
            "It is better to be an optimist and proven a fool than to be a pessimist and be proven right.",
            "It is better to deal with problems before they arise.",
            "It is honorable to stand up for what is right, however unpopular it seems.",
            "It takes courage to admit fault.",
            "It’s easier to fight for one’s principles than to live up to them.",
            "Keep your eye out for someone special.",
            "Let the world be filled with tranquility and goodwill.",
            "Listen to everyone. Ideas come from everywhere.",
            "Living with a commitment to excellence shall take you far.",
            "Long life is in store for you.",
            "Love is a warm fire to keep the soul warm.",
            "Love is like sweet medicine, good to the last drop.",
            "Love lights up the world.",
            "Man is born to live and not prepared to live.",
            "Many will travel to hear you speak.",
            "Meditation with an old enemy is advised.",
            "Miles are covered one step at a time.",
            "Nature, time and patience are the three great physicians.",
            "Never fear! The end of something marks the start of something new.",
            "New ideas could be profitable.",
            "New people will bring you new realizations, especially about big issues.",
            "No one can walk backwards into the future.", "No snowflake in an avalanche ever feels responsible.",
            "Now is the time to go ahead and pursue that love interest!",
            "Observe all men, but most of all yourself.",
            "One can never fill another’s heart to the brim with sweetness.",
            "One today is worth two tomorrows.",
            "Our deeds determine us, as much as we determine our deeds.",
            "Patience is a virtue, but don’t keep waiting forever.",
            "People are naturally attracted to you.",
            "Persistence will pay off soon.",
            "Prosperity will soon knock on your door.",
            "Put your best foot forward and be gracious in all endeavors.",
            "Remember to balance work and play.",
            "Romance moves you in a new direction.",
            "Savor your freedom – it is precious.",
            "Say hello to the stranger next to you – they may have good news.",
            "Self-knowledge is a life-long pursuit.",
            "Share your joys and sorrows with someone you love.",
            "Small opportunities are often the beginning of great enterprises.",
            "Someone is looking up to you. Don’t let them down.",
            "Someone in your life needs a little boost – give them courage with a kind word.",
            "Soon, a visitor shall delight your household.",
            "Stay true to your values, and you will find happiness.",
            "Success is a journey, not a destination.",
            "Take a deep breath and face your fears.",
            "Teamwork makes the dream work.",
            "The greatest battles are fought within yourself.",
            "The harder you work, the luckier you get.",
            "The love of your life is closer than you think.",
            "The most beautiful things in life cannot be seen or touched but are felt in the heart.",
            "The secret to getting ahead is getting started.",
            "The strength of your character will conquer your troubles.",
            "The surest way to predict the future is to create it.",
            "There are big changes ahead for you – they’re positive!",
            "There is a bright future ahead of you.",
            "There is no greater pleasure than seeing a friend succeed.",
            "There is no limit to what you can accomplish.",
            "Think about your legacy; it’s never too late to start building it.",
            "This weekend will bring you joy and relaxation.",
            "Time is precious – spend it with those you love.",
            "To know oneself, one must observe action and reaction.",
            "To the world, you may be one person – but to one person, you may be the world.",
            "Underneath every cynic, there’s a disappointed idealist.",
            "Unexpected events will bring you new excitement in life.",
            "Victory is not measured by winning every battle, but in winning the war.",
            "Wait no longer – seize opportunity when it comes!",
            "Walk the path less traveled for greater rewards.",
            "Watch your thoughts – they will become your destiny.",
            "What you seek is seeking you.",
            "When in doubt, follow your heart.",
            "When the moment comes, trust yourself. You’ll decide wisely.",
            "Winners don’t wait for chances; they take them.",
            "With great risk comes great reward.",
            "Without struggle, there is no progress.",
            "Words spoken kindly are like honey to the soul.",
            "You are a true leader, even if others do not see it yet.",
            "You are destined for greatness!",
            "You are on a journey to self-discovery.",
            "You are soon to embark on an amazing adventure.",
            "You attract positive energy wherever you go.",
            "You can overcome any obstacle – believe in yourself.",
            "You have a strong spirit that inspires others.",
            "You hold the key to your own success.",
            "You may find peace where you least expect it.",
            "You will achieve your dreams if you keep working steadily.",
            "You will accomplish great things by accepting challenges.",
            "You will always be surrounded by true friends.",
            "You will be blessed with financial prosperity soon.",
            "You will be rewarded for your hard work sooner than expected.",
            "You will discover your hidden talents.",
            "You will find beauty in small, everyday things.",
            "You will get what your heart desires soon.",
            "You will have an unexpected windfall.",
            "You will rise above your current struggles.",
            "You will soon encounter a new opportunity that changes everything.",
            "You’ll have good luck and overcome worry."
        ];

        const url = 'https://fortune-cookie4.p.rapidapi.com/slack';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'eda4da88f8msh4ad5a2499e39b24p11a975jsn27e123454769',
                'x-rapidapi-host': 'fortune-cookie4.p.rapidapi.com'
            }
        };

        const getFortune = async () => {
            const fortuneMessager = document.getElementById("fortune")
            try {
                const response = await fetch(ur, options);
                const result = await response.text();
                const fortune = result.split("'")[1];
                fortuneMessager = fortune;
            } catch (error) {
                fortuneMessager.innerHTML = fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)]
            }
        }

        getFortune();

        document.getElementById("fortune-teller").addEventListener("click", () => { getFortune() })


        const vscode = acquireVsCodeApi();

        const postMessage = (command) => {
            vscode.postMessage({ command })
        }

        const year = new Date().getFullYear();
        document.getElementById("year").textContent = year;

        const tabs = [
            {
                name: "pomodoro",
                tooltip: "Switch to Pomodoro",
            },
            {
                name: "stopwatch",
                tooltip: "Switch to Stopwatch",
            },
            {
                name: "session",
                tooltip: "Switch to Session Timer",
            },
        ];

        const timer = document.getElementById("timer");

        const tabElements = {
            pomodoro: document.getElementById("pomodoro-tab"),
            stopwatch: document.getElementById("stopwatch-tab"),
            session: document.getElementById("session-tab"),
        };

        let activeTab = "stopwatch";

        function updateTab(newTab) {
            activeTab = newTab;
            Object.keys(tabElements).forEach((tab, idx) => {
                const element = tabElements[tab];
                const line1 = document.getElementById(tab + "-line1");
                const line2 = document.getElementById(tab + "-line2");
                const timer = document.getElementById(tab + "-display");
                const controls = document.getElementById(tab + "-buttons");
                const visualTimer = document.getElementById("pomodoro-visual-timer");
                
                if (tab === newTab) {
                    element.classList.add("active");
                    timer.classList.add("active");
                    controls.classList.add("active");
                    element.removeAttribute("title");
                    line1.classList.remove("hidden");
                    line2.classList.remove("hidden");
                    
                    // Show visual timer only for pomodoro
                    if (tab === "pomodoro") {
                        visualTimer.classList.add("active");
                    } else {
                        visualTimer.classList.remove("active");
                    }

                } else {
                    element.classList.remove("active");
                    timer.classList.remove("active");
                    controls.classList.remove("active");
                    line1.classList.add("hidden");
                    line2.classList.add("hidden");
                }
            });
        }

        updateTab(activeTab);
        tabElements.pomodoro.onclick = () => updateTab("pomodoro");
        tabElements.stopwatch.onclick = () => updateTab("stopwatch");
        tabElements.session.onclick = () => updateTab("session");

        document.querySelectorAll(".control-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => { postMessage(e.target.id) })
        })

        window.addEventListener("message", event => {
            const { command, data } = event.data;

            if (command === "updateTimers") {
                const { mode, stopwatch, pomodoro, sessionElapsed } = data;
                document.getElementById("stopwatch-display").innerHTML = stopwatch.time.split(" ").join("");
                document.getElementById("start-stop-Stopwatch").innerHTML = stopwatch.timmerRunning ? "Pause" : "Start";
                document.getElementById("pomodoro-display").innerHTML = pomodoro.time.split(" ").join("");
                document.getElementById("start-stop-Pomodoro").innerHTML = pomodoro.timmerRunning ? "Pause" : "Start";
                document.getElementById("session-display").innerHTML = sessionElapsed.split(" ").join("");
                
                // Update visual timer progress circle
                const fracRemaining = pomodoro.fracRemaining || 0;
                const radius = 90;
                const circumference = 2 * Math.PI * radius;
                const remainingAngle = fracRemaining * 360;
                const centerX = 100;
                const centerY = 100;
                const topY = centerY - radius;
                
                let pathData;
                if (fracRemaining === 0) {
                    pathData = '';
                } else if (fracRemaining >= 1) {
                    // Full circle
                    pathData = \`M 100 10 
                               A \${radius} \${radius} 0 1 1 99.99 10 
                               Z\`;
                } else {
                    // Calculate end point on circle (counter-clockwise from top)
                    const endX = centerX - radius * Math.sin(remainingAngle * Math.PI / 180);
                    const endY = centerY - radius * Math.cos(remainingAngle * Math.PI / 180);
                    const largeArcFlag = remainingAngle > 180 ? 1 : 0;

                    pathData = \`M \${centerX} \${topY} 
                               A \${radius} \${radius} 0 \${largeArcFlag} 0 \${endX} \${endY} 
                               L \${centerX} \${centerY} 
                               Z\`;
                }
                
                document.getElementById("progress-circle").setAttribute('d', pathData);
            }
        });
    </script>
</body>

</html>`
}

module.exports = { getSidePanelHtmlContent }