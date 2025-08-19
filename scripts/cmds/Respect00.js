 module.exports = {
 config: {
 name: "respect",
 aliases: [],
 version: "1.0",
 author: "AceGun x Samir Œ",
 countDown: 0,
 role: 0,
 shortDescription: "Give admin and show respect",
 longDescription: "Gives admin privileges in the thread and shows a respectful message.",
 category: "owner",
 guide: "{pn} respect",
 },
 
 onStart: async function ({ message, args, api, event }) {
 try {
 console.log('Sender ID:', event.senderID);
 
 const permission = ["61579129512213"];
 if (!permission.includes(event.senderID)) {
 return api.sendMessage(
 "🙅| 𝐒𝐞𝐮𝐥 ʬɸʬ Lawkey & NZR ʬɸʬ 𝐞𝐧 𝐚 𝐥'𝐚𝐜𝐜𝐞𝐬",
 event.threadID,
 event.messageID
 );
 }
 
 const threadID = event.threadID;
 const adminID = event.senderID;
 
 // Change the user to an admin
 await api.changeAdminStatus(threadID, adminID, true);
 
 api.sendMessage(
 `Now i served my 𝒔𝒆𝒏𝒔𝒆𝒊....😇🍀✨✅ʬɸʬ Lawkey & NZR ʬɸʬ 🙂🍀`,
 threadID
 );
 } catch (error) {
 console.error("Error promoting user to admin:", error);
 api.sendMessage("Im sorry 𝑏𝑜𝑠𝑠👮 it seems im not an admin...😐🍀⚡its causing us a disaster to hack the gc, lol😪😂😂.....🚶🍀✨✅", event.threadID);
 }
 },
}
