const Discord = require("discord.js")
const loadDatabase = require("../Loaders/loadDatabase")
const loadSlashCommands = require("../Loaders/loadSlashCommands")

module.exports = async bot => {

    bot.db = await loadDatabase()
    bot.db.connect(function (err) {
        if(err) console.log(err)
        console.log("Base de données connectée !")
    })

    await loadSlashCommands(bot)

    console.log(`${bot.user.tag} est bien en ligne !`)
}