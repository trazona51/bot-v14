const Discord = require("discord.js");

module.exports = {
    name: "say",
    description: "Fait dire quelque chose au bot, répétant le message spécifié par l'utilisateur",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "Information",
    options: [
        {
            type: "string",
            name: "message",
            description: "Le message que le bot doit dire.",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {
        const sayMessage = args.getString("message");

        // Vérifie si le message à dire est vide
        if (!sayMessage) {
            return message.reply("Veuillez fournir un message à dire !");
        }

        // Envoie le message
        message.channel.send(sayMessage);
    }
};
