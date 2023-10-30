const Discord = require('discord.js')
const Canvas = require('discord-canvas-easy')

module.exports = {

    name: "rank",
    description: "Affiche le niveau d'expérience (XP) d'un membre spécifique sur le serveur Discord",
    permission: "Aucune",
    dm: false,
    category: "Information",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur à vérifier",
            required: false,
            autocomplete: false
        }
    ],
    
    async run(bot, message, args, db) {

        let user;
        if (args.getUser("utilisateur")) {
            user = args.getUser("utilisateur")
            if (!user || !message.guild.members.cache.get(user?.id)) return message.reply("Pas de membre à vérifier !")
        } else user = message.user;

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, all) => {

                if (req.length < 1) return message.reply("Ce membre n'a pas d'xp !")

                await message.deferReply()

                const calculXp = (xp, level) => {
                    let xptotal = 0;
                    for(let i = 0; i < level; i++) xptotal += i * 1000
                    xptotal += xp;
                    return xptotal;
                }

                let leaderboard = await all.sort(async (a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))        
                let xp = parseInt(req[0].xp)
                let level = parseInt(req[0].level)
                let rank = leaderboard.findIndex(r => r.user === user.id) + 1
                let need = (level + 1) * 1000;

                let Card = await new Canvas.Card()
                    .setBackground("https://th.bing.com/th/id/OIP.MQOnTJuYGdudsPQZbbms7wHaEK?pid=ImgDet&rs=1")
                    .setBot(bot)
                    .setColorFont("#ffffff")
                    .setRank(rank)
                    .setUser(user)
                    .setColorProgressBar("#eeaf04")
                    .setGuild(message.guild)
                    .setXp(xp)
                    .setLevel(level)
                    .setXpNeed(need)
                    .toCard()

                await message.followUp({ files: [new Discord.AttachmentBuilder(Card.toBuffer(), { name: "rank.png" })] })
            })
        })
    } 
}