const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

let aiEnabled = true;
global.chatHistory = global.chatHistory || {};

function getPhilippinesDateTime() {
  const date = new Date();
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

module.exports = {
  config: {
    name: "law",
    aliases: ["yanzu", "Zephyr", "babe", "zep"],
    version: "7.1.0",
    author: "kylepogi",
    countDown: 0,
    role: 0,
    description: "Chat with AI and get PH time",
    category: "AI",
    guide: {
      en: `🔹 Use 'ai enable' to enable AI\n🔹 Use 'ai disable' to disable it\n🔹 Use 'ai time' to get the current time in the Philippines`
    }
  },

  onStart: async function () {
    console.log('Command "law" initialized.');
  },

  onChat: async function ({ event, message, api, args = [], usersData }) {
    const body = (event.body || '').toLowerCase();
    const userID = event.senderID;
    const data = await usersData.get(userID);
    const name = data?.name || "User";
    const mention = [{ tag: name, id: userID }];
    const prefix = 'ai';

    if (!body.startsWith(prefix)) return;

    const query = body.slice(prefix.length).trim();

    if (query === "") {
      return message.reply({
        body: `👋 Hello ${name}, I am Lawkey'𝘀 𝗕𝗼𝘁, your AI assistant. How can I help you?\n\n📅⏰ ${getPhilippinesDateTime()}`,
        mentions: mention
      });
    }

    if (query === 'time') {
      return message.reply({
        body: `👋 Hello ${name}\n\n🕒 Current time in the Philippines:\n${getPhilippinesDateTime()}`,
        mentions: mention
      });
    }

    if (query === 'switch') {
      return message.reply({
        body: `${name}, toggle AI on or off below:`,
        mentions: mention,
        buttons: [
          { label: "🟢 TURN ON", type: 1, command: `${prefix} enable` },
          { label: "🔴 TURN OFF", type: 1, command: `${prefix} disable` }
        ]
      });
    }

    if (query === 'enable') {
      aiEnabled = true;
      return message.reply({ body: `✅ ${name}, AI is now ENABLED.`, mentions: mention });
    }

    if (query === 'disable') {
      aiEnabled = false;
      return message.reply({ body: `⛔ ${name}, AI is now DISABLED.`, mentions: mention });
    }

    if (!aiEnabled) {
      return message.reply({
        body: `⚠️ AI is currently turned OFF, ${name}.\n🔹 Use 'ai enable' to turn it on.`,
        mentions: mention
      });
    }

    const prompt = args.join(" ").trim();
    if (!prompt) {
      return message.reply("❗ Please enter a question after 'ai'.");
    }

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const { data } = await axios.get(
        `https://sandipbaruwal.onrender.com/gemini?prompt=${encodedPrompt}`,
        { timeout: 10000 }
      );

      const result = data.answer || "❌ No answer returned.";

      return message.reply({
        body: `👋 Hello ${name} (${userID})\n❓ Your asked: “${prompt}”\n━━━━━━━━━━━━━━━━\n💡 Answer:\n${result}\n\n🗓⏰ Date&Time: ${getPhilippinesDateTime()}`,
        mentions: mention
      }, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: userID
          });
        }
      });

    } catch (error) {
      console.error("AI Request Error:", error.message);
      return message.reply("❌ Error: Unable to reach the AI service.");
    }
  },

  onReply: async function ({ api, message, event, args = [], usersData }) {
    const senderID = event.senderID;
    const userData = await usersData.get(senderID);
    const senderName = userData?.name || "User";
    const prompt = args.join(" ").trim();
    const mention = [{ id: senderID, tag: senderName }];

    if (!prompt) {
      return message.reply("❗ Please provide a follow-up question.");
    }

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const { data } = await axios.get(
        `https://sandipbaruwal.onrender.com/gemini?prompt=${encodedPrompt}`,
        { timeout: 10000 }
      );
      const geminiAnswer = data?.answer || "❌ No answer returned from AI.";

      return message.reply({
        body: `💬 Follow-up from ${senderName}\n❓ your asked: “${prompt}”\n\n📨 Answer:\n${geminiAnswer}`,
        mentions: mention
      });

    } catch (err) {
      console.error("Follow-up Error:", err.message);
      return message.reply("❌ Error retrieving the follow-up response.");
    }
  }
};
