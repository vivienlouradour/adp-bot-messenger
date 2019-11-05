const login = require("facebook-chat-api")
const fs = require("fs")
const loginDataFile = "./login-data.json"

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

login(loginData, (err, api) => {
    if (err) return console.error(err)

    let appState = api.getAppState()
    fs.writeFile(loginDataFile, JSON.stringify(appState, null, 2), err => {
        if (err)
            console.error('failed to save appState : ' + JSON.stringify(err))
    })

    api.listen((err, message) => {
        console.log('Message received (from id ' + message.senderID + '): ' + message.body)
        //api.sendMessage(message.body, message.threadID);
    });
});