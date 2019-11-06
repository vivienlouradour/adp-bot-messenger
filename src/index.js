const login = require("facebook-chat-api")
const fs = require("fs")
const loginDataFile = "./config/login-data.json"
const command = require("./command/botCommand")
const botMessage = require("./command/botMessage")
const messageDelay = 60 * 60 * 6 * 1000

// create a rolling file logger based on date/time that fires process events
const opts = {
    errorEventName: 'error',
    logDirectory: './logs', // NOTE: folder must exist and be writable...
    fileNamePattern: 'adp-bot-messenger-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};
const log = require('simple-node-logger').createRollingFileLogger(opts);

log.info('Starting bot...')

const loginDataExists = fs.existsSync(loginDataFile)
let loginData
if (loginDataExists) {
    log.info('reading loginData from file')
    loginData = { appState: JSON.parse(fs.readFileSync(loginDataFile)) }
}
else {
    log.info('reading credentials from config.json file')
    const config = JSON.parse(fs.readFileSync("./config/config.json"))
    loginData = { email: config.facebook.email, password: config.facebook.password }
}

login(loginData, (err, api) => {
    if (err) return console.error(err)

    let appState = api.getAppState()
    fs.writeFile(loginDataFile, JSON.stringify(appState, null, 2), err => {
        if (err)
            log.error('failed to save appState : ' + JSON.stringify(err))
    })

    let botId = api.getCurrentUserID()

    //Use recursion to send messages in good order
    let sendMessages = (threadId, messages) => {
        if (messages.length > 0) {
            api.sendMessage(
                messages[0],
                threadId,
                (err, messageInfo) => {
                    sendMessages(threadId, messages.slice(1))
                }
            )
            log.info('Message sent to ' + threadId + ' : ' + messages[0])
        }
    }

    //Send the message each 6 hours
    setInterval(function () {
        api.getThreadList(999, null, [], (err, list) => {
            if (err) return console.error(err)
            let groupIds = list.filter(thread => thread.isGroup).map(group => group.threadID)
            log.info('sending automatic message to ' + groupIds.length + ' conversation(s)')

            let messages = botMessage.getRandomMessages()
            groupIds.forEach(groupId => {
                sendMessages(groupId, messages)
            })
        })
    }, messageDelay);

    api.listen((err, message) => {
        if (message.senderID != botId) {
            //parse message to see if it's command (!adp command)   
            if (command.isCommand(message.body)) {
                log.info('Command received from sender ' + message.senderID + ' : ' + message.body)

                let responses = command.parseCommand(message.body)
                sendMessages(message.threadID, responses)
            }
        }
    })
})









