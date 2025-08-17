module.exports = {
	config: {
		name: "goiadmin",
		author: "LawkeyandNZR",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "BOT",
		guide: "{pn}"
	},

onChat: function({ api, event }) {
	if (event.senderID !== "61579129512213") {
		var aid = ["61579129512213"];
		for (const id of aid) {
		if ( Object.keys(event.mentions) == id) {
			var msg = ["হু, আমার দেখা পাওয়ার জন্য অপেক্ষা করো। 🦆 "];
			return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
		}
		}}
},
onStart: async function({}) {
	}
};
