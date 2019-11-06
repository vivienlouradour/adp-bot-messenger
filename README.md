# ADP bot messenger

Spam for french ADP referendum.  
Add it to a group conversation and it will start to spam.  
[https://www.facebook.com/bot.adp.5](https://www.facebook.com/bot.adp.5)    

## Production with Docker

```bash
# git pull project
git pull https://github.com/vivienlouradour/adp-bot-messenger

# build image
docker build -t adp-bot-messenger-image .

# run container
# assume that you have a /docker-data/adp-bot-messenger/logs directory
# assume that you have a /docker-data/adp-bot-messenger/config directory with either "config.json" or "login-data.json" file
docker run -d --name adp-bot-messenger -v /docker-data/adp-bot-messenger/config/:/usr/src/app/config -v /docker-data/adp-bot-messenger/logs/:/usr/src/app/logs adp-bot-messenger-image
```
