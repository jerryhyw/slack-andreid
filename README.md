# slack-andreid

## Getting Started

1. Clone the repository
2. Run 'npm install'
3. Create '.env' file with 'SLACK_APP_TOKEN' and 'SLACK_BOT_TOKEN' values (optionally add 'PORT')
4. Run 'npm run start'

## Running The Bot

1. Install Andreid to your Slack Workspace
2. Add the app to the channels you want to run it in. This includes both the source and destination channels.
3. The bot can be activated by the slask command `/andreid` and it has 2 options: `run` and `config`
4. The main functions of the bot requires a running web server. This can easily be done in `socket mode`. You can read more about it [here](https://docs.slack.dev/tools/bolt-js/concepts/socket-mode/).