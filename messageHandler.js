import { WebClient, LogLevel } from '@slack/web-api';

const MESSAGE_LIMIT = 50;
const LINK_LIMIT_PER_MESSAGE = 5;

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.INFO
  // logLevel: LogLevel.DEBUG
});

export const getChannels = async (channelNames) => {
  let matchedChannels = []; 
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await client.conversations.list({
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

export const getMessages = async (channel, timestamp) => {
  try {
    // Call the conversations.history method using WebClient
    const result = await client.conversations.history({
      channel: channel.id,
      oldest: timestamp,
      limit: MESSAGE_LIMIT
    });

    return result.messages;
  }
  catch (error) {
    if (error.code === 'slack_webapi_platform_error' && error.data.error === 'not_in_channel') {
      console.error(`Please invite @Andreid to #${channel.name} to retreieve its messages`);
    } else {
      console.error(error);
    }
  }
}

export const getReplies = async (channel, ts, timestamp) => {
  try {
    // Call the conversations.replies method using WebClient
    const result = await client.conversations.replies({
      channel: channel.id,
      ts,
      oldest: timestamp,
      limit: MESSAGE_LIMIT
    });

    // remove duplicated parent message in thread before returning
    return result.messages.filter((message) => message.thread_ts !== message.ts);
  }
  catch (error) {
    if (error.code === 'slack_webapi_platform_error' && error.data.error === 'not_in_channel') {
      console.error(`Please invite @Andreid to #${channel.name} to retreieve its messages`);
    } else {
      console.error(error);
    }
  }
}

export const getPermalinkForMessage = async(channel, ts) => {
   try {
    // Call the chat.getPermalink method using WebClient
    const result = await client.chat.getPermalink({
      channel: channel.id,
      message_ts: ts
    });

    if (result.ok) {
      return result.permalink;
    }
  }
  catch (error) {
    console.error(error);
  }
}

export const searchMessages = async () => {
  try {
    // Call the search.messages method using WebClient
    const result = await client.search.messages({
      // channel: channel.id,
      // ts,
      // oldest: timestamp,
      // limit: MESSAGE_LIMIT
      query: '',
      count: 50,
      page: 1,
      sort: 'timestamp',
      sort_dir: 'asc'
    });

    return result.messages;
  }
  catch (error) {
    if (error.code === 'slack_webapi_platform_error' && error.data.error === 'not_in_channel') {
      console.error(`Please invite @Andreid to #${channel.name} to retreieve its messages`);
    } else {
      console.error(error);
    }
  }
}

export const publishMessage = async (sourceChannel, destinatonChannel, permalinks) => {
  try {
    if (permalinks.length > 0) {
      // Call the chat.postMessage method using WebClient
      const result = await client.chat.postMessage({
        channel: destinatonChannel.id,
        text: `New mentions from #${sourceChannel.name}:`
      });

      const permalinksCopy = [];
      permalinksCopy.push(...permalinks);

      while (permalinksCopy.length) {
        let tempList = permalinksCopy.splice(0, LINK_LIMIT_PER_MESSAGE);
        let textWithLinks = tempList.reduce((acc, curr) => acc + (acc && '\n') + curr);
        const result = await client.chat.postMessage({
          channel: destinatonChannel.id,
          text: textWithLinks
        });
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}
