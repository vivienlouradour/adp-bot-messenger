const moment = require("moment")
const fs = require("fs")

const messages = JSON.parse(fs.readFileSync("../messages.json"))
const adpEndDate = moment("12/03/2020 23:59:59", "DD/MM/YYYY HH:mm:ss")

function parse (str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

exports.getRandomMessage = () => {
    let randomIndex = Math.floor(Math.random() * messages.length)
    let randomMessage = messages[randomIndex]
    let duration = moment.duration(adpEndDate.diff(moment()))
    let durationStr = duration.months() + ' mois, ' + duration.days() + ' jour(s) et ' + duration.hours() + ' heure(s)'

    let formatedMessage = '/!\\ Referendum ADP /!\\ \n' + parse(randomMessage, durationStr)

    return formatedMessage
}

exports.getHelpMessage = () => {
    let helpMessage = `
    !adp commande
    Commandes : 
    - info: décompte du temps restant avant la fin du référendum
    - help: affiche message d'aide
    `
    console.log(helpMessage)
    return helpMessage
}
