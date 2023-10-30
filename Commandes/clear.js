const Discord = require("discord.js")

module.exports = {

    name: "clear",
    description: "Supprime un nombre spécifié de messages sur un salon ou d'un utilisateur",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Le salon où effacer les messages",
            required: true,
            autocomplete: false
        }, {
            type: "number",
            name: "nombre",
            description: "Le nombre de messages à supprimer",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {
   
        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Pas de salon !")

        let number = args.getNumber("nombre")
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Il nous faut un nombre entre `0` et `100` inclus !")

        await message.deferReply({ephemeral: true});

        try {

            let messages = await channel.bulkDelete(parseInt(number))

            await message.followUp({content: `j'ai bien supprimé \`${messages.size}\` message(s) dans le salon ${channel}!`, ephemeral: true})

        } catch (err) {

            let messages = [...(await channel.messages.fetch()).filter(msg => !msg.interaction && (Date.now() - msg.createdAt) <= 1209600000).values()]
            if(messages.length <= 0) return message.followUp("Aucun message à supprimer car ils datent tous de plus de 14 jours !")
            await channel.bulkDelete(messages)

            await message.followUp({content: `j'ai pu supprimé uniquement \`${messages.length}\` message(s) dans le salon ${channel} car les autres dataient de plus de 14 jours !`, ephemeral: true})
        }
    } 
}