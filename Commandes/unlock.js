const Discord = require("discord.js")

module.exports = {

    name: "unlock",
    description: "Déverrouille un salon, permettant aux utilisateurs d'y envoyer des messages à nouveau",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Le salon à unlock",
            required: true,
            autocomplete: false
        }, {
            type : "role",
            name: "role",
            description: "Le role unlock",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon")
        if(!message.guild.channels.cache.get(channel.id)) return message.reply("Pas de salon")
        if(channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.GuildPublicThread && channel.type !== Discord.ChannelType.GuildPrivateThread) return message.reply("Envoyer un salon textuel")

        let role = args.getRole("role")
        if(role && !message.guild.roles.cache.get(role.id)) return message.reply("Pas de role")
        if(!role) role = message.guild.roles.everyone;

        if(channel.permissionOverwrites.cache.get(role.id)?.allow.toArray(false).includes("SendMessages")) return message.reply(`Le role \`${role.name}\` est déjà unlock dans le salon ${channel}`)

        if(channel.permissionOverwrites.cache.get(role.id)) await channel.permissionOverwrites.edit(role.id, {SendMessages: true})
        else await channel.permissionOverwrites.create(role.id, {SendMessages: true})

        await message.reply(`Le rôle \`${role.name}\` a bien été unlock dans le salon ${channel}`)


    }
}