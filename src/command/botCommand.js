const botMessage = require("./botMessage")

exports.parseCommand = message => {
    let messages = message.split(" ")
    let command = ''
    if (messages.length >= 2)
        command = messages[1]

    switch (command.toLowerCase()) {
        case "info":
        case "infos":
            return botMessage.getRandomMessages()
        case "help":
        case "aide":
            return botMessage.getHelpMessage()
        case "source":
        case "sources":
            return botMessage.getSourceMessage()
        default:
            return botMessage.getDefaultMessage()
    }
}


exports.isCommand = message => {
    return message.split(" ").length <= 2 && message.toLowerCase().startsWith('!adp')
}