import { WebClient, LogLevel } from '@slack/web-api';

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG
});

export const getChannels = async (app, channelNames) => {
  let matchedChannels = []; 
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN
    });

    matchedChannels = result.channels.filter((channel) => channelNames.includes(channel.name));
    matchedChannels.forEach((channel) => console.log(channel.id));

    return matchedChannels;
  }
  catch (error) {
    console.error(error);
  }
}
