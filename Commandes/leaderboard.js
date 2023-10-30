const Discord = require('discord.js')
const Canvas = require('discord-canvas-easy')

module.exports = {

    name: "leaderboard",
    description: "Affiche le classement de l'expérience (XP) des membres sur le serveur Discord",
    permission: "Aucune",
    dm: false,
    category: "Information",
    options: [],
    
    async run(bot, message, args, db) {

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, req) => {

            if(req.length < 1) return message.reply("Personne n'a de l'xp !")

            await message.deferReply()

            const calculXp = (xp, level) => {
                let xptotal = 0;
                for(let i = 0; i < level; i++) xptotal += i * 1000
                xptotal += xp;
                return xptotal;
            }

            let leaderboard = await req.sort((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))

            const Leaderboard = await new Canvas.Leaderboard()
            .setBot(bot)
            .setGuild(message.guild)
            .setBackground("https://cdn.discordapp.com/attachments/1152008897989718026/1167217569728569444/Black_and_Red_Modern_Welcome_Discord_Profile_Banner_1.png?ex=654d5312&is=653ade12&hm=38e96e1dbdc178b8431542bedf8151006e45743f0cf7312cc8b1b19364d6e60b&")
            .setColorFont("#ffffff")
            
            for(let i =0; i< (req.length > 10 ? 10 : req.length); i++) {

                await Leaderboard.addUser(await bot.users.fetch(leaderboard[i].user), parseInt(leaderboard[i].level), parseInt(leaderboard[i].xp), (parseInt(leaderboard[i].level) + 1) * 1000)
            }

            const Image = await Leaderboard.toLeaderboard()

            await message.followUp({files: [new Discord.AttachmentBuilder(Image.toBuffer(), {name: "leaderboard.png"})]})
        })
    }
}