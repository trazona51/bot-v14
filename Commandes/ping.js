const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "Affiche la latence du bot",
    permission: "Aucune",
    dm: true,
    category: "Information",

    async run(bot, message, args) {
        // Répond avec la latence du bot
        await message.reply(`Ping : \`${bot.ws.ping}\` ms`);
    }
};
