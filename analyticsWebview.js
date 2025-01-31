
function generateAnalyticsHtml(context) {
  // Retrieve history from VS Code's state
  const stopwatchHistory = context.globalState.get("stopwatchHistory", []);
  const pomodoroHistory = context.globalState.get("pomodoroHistory", []);
  const sessionHistory = context.globalState.get("sessionHistory", []);

  // Convert history into datasets
  const data = {
    labels: ["Stopwatch", "Pomodoro", "Session Tracker"],
    datasets: [
      {
        data: [
          stopwatchHistory.length,
          pomodoroHistory.length,
          sessionHistory.length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Analytics</title>
      <style>
        #chart {
            width: 100%;
            max-width: 500px;
            max-height: 500px;
        }

        .container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
      </style>
    </head>
    <body>
      <h1>TimeCoder Analytics</h1>
    <div class="container">
        <canvas id="chart"></canvas>
    </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
        const ctx = document.getElementById("chart").getContext("2d");
        const config = {
          type: "doughnut",
          data: ${JSON.stringify(data)},
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: "right" },
            },
          },
        };
        new Chart(ctx, config);
      </script>
    </body>
    </html>
  `;
}

module.exports = { generateAnalyticsHtml };