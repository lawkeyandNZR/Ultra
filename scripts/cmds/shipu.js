const axios = require("axios");
const mongoose = require("mongoose");

// MongoDB schema (auto create if not exists)
const ShipuMemory = mongoose.models.ShipuMemory || mongoose.model("ShipuMemory", new mongoose.Schema({
 userID: String,
 memory: String,
 personality: { type: String, default: "default" }
}));

const apiUrl = "https://shipu-ai.onrender.com/api.php?action=";

module.exports = {
 config: {
 name: "shipu",
 aliases: ["law", "ai", "lawkey", "kyle", "ultron"],
 version: "1.2",
 author: "DevL4w",
 countDown: 1,
 role: 0,
 shortDescription: {
 en: "Talk with ultron ai (with memory and personality)"
 },
 longDescription: {
 en: "Chat with ultra-powered ultronite AI. Continues chat with memory, supports personality modes."
 },
 category: "ai",
 guide: {
 en: "-shipu [message] or reply to ShiPu\n+shipu setpersonality [funny|formal|sarcastic]\nNo-prefix supported too"
 }
 },

 onStart: async function ({ api, event, args, message }) {
 const uid = event.senderID;
 const input = args.join(" ");

 if (!input) return message.reply("📩 | Please provide a message or reply to a ultron's message.");

 // Personality setter
 if (args[0]?.toLowerCase() === "setpersonality") {
 const mode = args[1]?.toLowerCase();
 if (!mode) return message.reply("⚙️ | Usage: +shipu setpersonality [mode]");
 await ShipuMemory.findOneAndUpdate({ ID: uid }, { personality: mode }, { upsert: true });
 return message.reply(`✅ | Personality set to **${mode}**`);
 }

 handleConversation(api, event, input);
 },

 onReply: async function ({ api, event }) {
 const userInput = event.body?.toLowerCase();
 if (!userInput) return;
 handleConversation(api, event, userInput);
 },

 onChat: async function ({ api, event }) {
 const body = event.body?.toLowerCase();
 if (!body) return;

 const prefixes = ["shipu", "law", "lawkey", "ultron", "ai", "kyle"];
 const matched = prefixes.find(p => body.startsWith(p));
 if (!matched) return;

 const content = body.slice(matched.length).trim();
 if (!content) {
 const prompts = [
 "👋 Hello Ultron's here, How may I help you!",
 "🤖 What would you like to request?",
 "🧠 Ultronite is thinking, please be patient...",
 "🚶 Im fed up with this AI stuff, Lawkey is out."
 ];
 const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
 return api.sendMessage(randomPrompt, event.threadID, (err, info) => {
 if (!info?.messageID) return;
 global.GoatBot.onReply.set(info.messageID, {
 commandName: "shipu",
 type: "reply",
 author: event.senderID
 });
 }, event.messageID);
 }

 handleConversation(api, event, content);
 }
};

// 🔁 Handle user conversation
async function handleConversation(api, event, userInput) {
 const uid = event.senderID;
 let memory = "";
 let personality = "default";

 // 🔍 Try to load memory/personality
 try {
 const userData = await ShipuMemory.findOne({ userID: uid });
 if (userData) {
 memory = userData.memory || "";
 personality = userData.personality || "default";
 }
 } catch (err) {
 console.log("⚠️ MongoDB not connected or memory fetch failed.");
 }

 try {
 const query = memory ? `${memory}\nUser: ${userInput}` : userInput;
 const fullQuery = `[${personality} mode]\n${query}`;

 const res = await axios.get(apiUrl + encodeURIComponent(fullQuery));
 const { botReply, status, author } = res.data;

 if (status !== "success") {
 return api.sendMessage("❌ | Ultron couldn't reply. Try again later.", event.threadID, event.messageID);
 }

 // Save new memory
 try {
 const newMemory = `User: ${userInput}\nShiPu: ${botReply}`;
 await ShipuMemory.findOneAndUpdate({ userID: uid }, { memory: newMemory }, { upsert: true });
 } catch (e) {
 console.log("⚠️ Failed to save memory.");
 }

 const styled = `╭────────────╮\n ▄ 🧠 Lawkey 𝗔𝗜 𝘀𝗮𝗶𝗱:\n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n\n\n${botReply}\n\n──────────────\n▄ 📩 𝗬𝗼𝘂: ${userInput}\n▄▄▄▄▄▄▄▄▄▄▄▄▄\n╔══════════╗\n║ 👤𝗠𝗼𝗱𝗲: ${personality}\n║ 🖊️𝗔𝘂𝘁𝗵𝗼𝗿: Lawkey\n║ Marvellous\n╚══════════╝`;

 api.sendMessage(styled, event.threadID, (err, info) => {
 if (!info?.messageID) return;
 global.GoatBot.onReply.set(info.messageID, {
 commandName: "shipu",
 type: "reply",
 author: event.senderID
 });
 }, event.messageID);
 } catch (err) {
 console.error(err);
 api.sendMessage("⚠️ | I need time to think this through...", event.threadID, event.messageID);
 }
}
