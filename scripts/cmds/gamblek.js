 module.exports = {
  config: {
    name: "gamble",
    aliases: ["gb"],
    version: "1.0",
    author: "ʬɸʬ LawkeyandNZR  ʬɸʬ",
    countDown: 10,
    role: 0,
    shortDescription: "Amuses toi bien au jeu du hasard",
    longDescription: "Only for rich, if you're poor you can win as well, lol... Good Luck players ",
    category: "game",
    guide: "{pn} <lawkey/nzr> <amount of money>"
  },

  onStart: async function ({ args, message, usersData, event }) {
    const betType = args[0];
    const betAmount = parseInt(args[1]);
    const user = event.senderID;
    const userData = await usersData.get(event.senderID);

    if (!["lawkey", "nzr"].includes(betType)) {
      return message.reply("🎁 | 𝘾𝙝𝙤ose : 'lawkey' or 'nzr'.");
    }

    if (!Number.isInteger(betAmount) || betAmount < 100) {
      return message.reply("🫢 |🙄minimum bet is 100$ Bro deposit more money");
    }

    if (betAmount > userData.money) {
      return message.reply("🫠 | Bro you are poor, try begging for money to play, or borrow from your bank\n\nThere are chances of you winning😋");
    }

    const dice = [1, 2, 3, 4, 5, 6];
    const results = [];

    for (let i = 0; i < 3; i++) {
      const result = dice[Math.floor(Math.random() * dice.length)];
      results.push(result);
    }

    const winConditions = {
      small: results.filter((num, index, arr) => num >= 1 && num <= 3 && arr.indexOf(num) !== index).length > 0,
      big: results.filter((num, index, arr) => num >= 4 && num <= 6 && arr.indexOf(num) !== index).length > 0,
    };

    const resultString = results.join(" | ");

    if ((winConditions[betType] && Math.random() <= 0.4) || (!winConditions[betType] && Math.random() > 0.4)) {
      const winAmount = 2 * betAmount;
      userData.money += winAmount;
      await usersData.set(event.senderID, userData);
      return message.reply(`❦ঔৣ☬LawkeyandNZR☬ঔৣ❦\n━━━━━━━━━━━━━━━━\n<(*✨∀✨*)ﾉ\n[🩸${resultString}🩸]\n🎁 | Good Game Boss, You Won → ☘${winAmount}€☘`);
    } else {
      userData.money -= betAmount;
      await usersData.set(event.senderID, userData);
      return message.reply(`❦ঔৣ☬LawkeyandNZR☬ঔৣ❦\n━━━━━━━━━━━━━━━━\n🖕🏻(#°□°)🖕🏻\n[🩸${resultString}🩸]\n🫣|�This is embarrasing, i thought your mom told ya' not to gamble🤔, Now you lost →☘${betAmount}€☘\nI'll tell your momma😎😂`);
    }
  }
}
