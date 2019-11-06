const moment = require("moment")
const fs = require("fs")

const randomMessages = JSON.parse(fs.readFileSync("./src/messages.json"))
const adpEndDate = moment("12/03/2020 23:59:59", "DD/MM/YYYY HH:mm:ss")

function parse (str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

exports.getRandomMessages = () => {
    let randomIndex = Math.floor(Math.random() * randomMessages.length)
    let randomMessage = randomMessages[randomIndex]
    let duration = moment.duration(adpEndDate.diff(moment()))
    let durationStr = duration.months() + ' mois, ' + duration.days() + ' jour(s) et ' + duration.hours() + ' heure(s)'

    let messages = [
        "⚠🕓 Referendum ADP 🕥⚠",
        parse(randomMessage, durationStr),
        "https://www.referendum.interieur.gouv.fr/soutien/etape-1"
    ]

    return messages
}

exports.getHelpMessage = () => {
    return [
        "Commandes disponibles :",
        "!adp info - décompte du temps restant avant la fin du référendum",
        "!adp aide - affiche le message d'aide",
        "!adp source - lien vers le code source"
    ]
}

exports.getSourceMessage = () => {
    return ["Code source disponible sur https://github.com/vivienlouradour/adp-bot-messenger"]
}

exports.getDefaultMessage = () => {
    return [
        "ptdr t ki ?",
        //"Infos : \"!adp help\" ou \"!adp aide\""
    ]
}
