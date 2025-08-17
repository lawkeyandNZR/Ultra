const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve chitron.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chitron.html"));
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🌐 Serving chitron.html at http://localhost:${PORT}`);
});

// 🚀 Start bot with account.dev.txt
function startBot(accountFileName) {
  const env = { ...process.env, ACCOUNT_FILE: accountFileName };
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env
  });

  child.on("close", (code) => {
    if (code === 2) {
      console.log(`[${accountFileName}] Bot exited with code 2. Restarting...`);
      startBot(accountFileName);
    } else {
      console.log(`[${accountFileName}] Bot exited with code ${code}`);
    }
  });
}

startBot("account.dev.txt");
