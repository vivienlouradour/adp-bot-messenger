const botMessage = require("./botMessage")

exports.parseCommand = message => {
    let messages = message.split(" ")
    let command = ''
    if (messages.length >= 2)
        command = messages[1]

    switch (command.toLowerCase()) {
        case "info":
            return botMessage.getRandomMessage()
        case "help":
            return botMessage.getHelpMessage()
        default:
            return 'mdr t ki ?'
    }
}


exports.isCommand = message => {
    return message.split(" ").length <= 2 && message.toLowerCase().startsWith('!adp')
}