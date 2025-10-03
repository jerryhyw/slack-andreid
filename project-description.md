# Team Cyberchooms - I'll be Hack - 2025 Hack-a-thon

[![thumbnail.png](./thumbnail.png)](https://youtu.be/jEq0e1TCv4k "Submission Video - Andreid")

## _The Andreid Bot_

A Slack crawler better known as Andreid that scans every channel for tags, phrases and PR links. Keep team requests from getting lost in the 100s of daily slack messages.

Andreid funnels critical requests into one team channel, providing a service that is simple, accessible, and impossible for your team to miss important messages.

The crawler can be customized to; 

- Scan Certain Channels
- Search for certain tags or phrases

## Features

- Configure the Andreid Bot to customize the slack channels it crawls
- Configure the destination channel, where Andreid will drop all missed messages
- Have Andreid search for certain mention users or team tags
- Compiles regular & threaded messages
- Paginate 5 links per message to allow to see all previews

Andreid is a lightweight Slack crawler bot based on saving you time
that people naturally will save time with.
As [John Connor] writes on the [T-1000] site

> The goal for Andreid's
> usage is to save people and teams
> time from searching through 100s of 
> channels and messages that could get
> lost in the noise of Slack.

## Tech

Andreid uses a number of open source projects to work properly:

- Slack Bolt Framework
- Java Script (WebSocket)
- Slack's Block UI Kit

## Getting Started

Andreid requires these simple steps found in the [READ.ME](https://github.com/jerryhyw/slack-andreid/blob/main/README.md) to run.

1. Clone the repository
2. Run 'npm install'
3. Create '.env' file with 'SLACK_APP_TOKEN' and 'SLACK_BOT_TOKEN' values (optionally add 'PORT')
4. Run 'npm run start'

## Running The Bot

1. Install Andreid to your Slack Workspace
2. Add the app to the channels you want to run it in. This includes both the source and destination channels.
3. The bot can be activated by the slask command `/andreid` and it has 2 options: `run` and `config`
4. The main functions of the bot requires a running web server. This can easily be done in `socket mode`. You can read more about it [here](https://docs.slack.dev/tools/bolt-js/concepts/socket-mode/).