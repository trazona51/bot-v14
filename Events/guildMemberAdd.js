const Discord = require('discord.js');

module.exports = async (bot, member) => {

    let db = bot.db;

    db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, req) => {

        if(req.length < 1) return;

        if(req[0].antiraid === "true") {

            try {await member.user.send("Vous ne pouvez pas rejoindre ce serveur car il est en mode antiraid !")} catch(err) {}
            await member.kick("Antiraid actif")
        }

        if(req[0].captcha === "false") return;

        let channel = member.guild.channels.cache.get(req[0].captcha)
        if(!channel) return;

        await channel.permissionOverwrites.create(member.user, {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true
        })

        let captcha = await bot.function.generateCaptcha()

        let msg = await channel.send({content: `**${member} vous avez 2 minutes pour compléter le Captcha! Si vous ne le réussissez pas, vous serez kick du serveur !**`, files: [new Discord.AttachmentBuilder((await captcha.canvas).toBuffer(),  {name: "captcha.png"})]})
        
        try {

            let filter = m => m.author.id === member.user.id;
            let response = (await channel.awaitMessages({filter, max: 1, time: 120000, error: ["time"]})).first()

            if(response.content === captcha.text) {
              
                await msg.delete()
                await response.delete()
                try {await member.user.send("**Hm.. nan.. tu n'as pas l'air d'un robot.. Félicitations ! Vous venez de réussir la vérification !**")} catch (err) {}
                await channel.permissionOverwrites.delete(member.user.id)
                await member.roles.add("1155576592421097492")
            
            } else {

                await msg.delete()
                await response.delete()
                try {await member.user.send("**Etes-vous un robot ? Vous venez d'échouer la vérification**")} catch (err) {}
                await channel.permissionOverwrites.delete(member.user.id)
                await member.kick("**Verification ratée !**")
}          } catch (err) {

                console.log("Tout va bien")
                await msg.delete()
                try {await member.user.send("**Vous avez mis trop de temps pour compléter le Captcha !**")} catch (err) {}
                await channel.permissionOverwrites.delete(member.user.id)
                await member.kick("**Trop de temps pour se faire vérifier !**")
            }
        })
    };