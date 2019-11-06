const login = require("facebook-chat-api")
const fs = require("fs")
const loginDataFile = "./login-data.json"
const command = require("./command/botCommand")
const botMessage = require("./command/botMessage")
const messageDelay = 60 * 60 * 6 * 1000
const config = JSON.parse(fs.readFileSync("./config.json"))

const loginDataExists = fs.existsSync(loginDataFile)
let loginData
if (loginDataExists) {
    console.log('reading loginData from file')
    loginData = { appState: JSON.parse(fs.readFileSync(loginDataFile)) }
}
else {
    loginData = { email: config.facebook.email, password: config.facebook.password }
}

console.log(botMessage.getRandomMessage())
login(loginData, (err, api) => {
    if (err) return console.error(err)

    let appState = api.getAppState()
    fs.writeFile(loginDataFile, JSON.stringify(appState, null, 2), err => {
        if (err)
            console.error('failed to save appState : ' + JSON.stringify(err))
    })

    //Send the message each 6 hours
    setInterval(function () {
        api.getThreadList(999, null, [], (err, list) => {
            if (err) return console.error(err)
            let threadIds = list.filter(thread => thread.isGroup).map(thread => thread.threadID)

            let message = botMessage.getRandomMessage()
            console.log(message)
            console.log(JSON.stringify(threadIds))
            threadIds.forEach(threadId => api.sendMessage(message, threadId))
        })
    }, messageDelay);

    api.listen((err, message) => {
        //parse message to see if it's command (!adp command)   
        console.log('Message received (from id ' + message.senderID + '): ' + message.body)
        if (command.isCommand(message.body)) {
            let response = command.parseCommand(message.body)
            api.sendMessage(response, message.threadID);
        }
    })
})





