import { getChannels, getMessages, getReplies, getPermalinkForMessage, publishMessage } from './messageHandler.js';

export const run = async (lastRunTime, config) => {
  // get source channels
  const srcChannels = await getChannels(config.source);
  console.log(`There are ${srcChannels.length} source channel(s) found`);

  // get destination channels
  const destChannels = await getChannels(config.destination);
  console.log(`There are ${destChannels.length} destination channel(s) found`);

  // convert to Unix timestamp
  const oldestTimestamp = Math.floor(lastRunTime.getTime() / 1000);

  // retrieve messages from source channels
  for (let channel of srcChannels) {
    let messagesInChannel = [];
    let permalinkList = [];
    try {
      let messages = await getMessages(channel, oldestTimestamp);
      messagesInChannel.push(...messages);
      console.log(`Retrieved ${messages.length} messages in channel #${channel.name}`);

      // retrieve threaded replies
      for (let message of messages) {
        if (message.reply_count && message.reply_count > 0) {
          let replies = await getReplies(channel, message.ts, oldestTimestamp);
          messagesInChannel.push(...replies);
        }
      }

      // filter messages by tags
      if (config.tags && config.tags.length) {
        const mentionMatchList = config.tags.map((userId) => {
          return `<@${userId}>`;
        });
        console.log(`The user mention match list is ${mentionMatchList}`);

        messagesInChannel = messagesInChannel.filter((message) => {
          const matchList = mentionMatchList.filter((tag) => message.text.includes(tag));
          return matchList.length > 0;
        });
      }

      // filter messages by configured filter
      // TODO
      //

      // sort messages by ascending timestamps
      // TODO: search.messages has built-in sort but lacks other features
      // messages here do not have timestamps and would require another API call to retrieve
      /* messagesInChannel = messagesInChannel.sort((a, b) => {
        //
      }); */

      // get permalinks for all filtered messages
      for (let message of messagesInChannel) {
        let messageLink = await getPermalinkForMessage(channel, message.ts);
        if (messageLink) {
          permalinkList.push(messageLink);
        }
      }
      console.log(`Message permalinks are ${permalinkList}`);

      for (let destChannel of destChannels) {
        await publishMessage(channel, destChannel, permalinkList);
      }
    } catch (error) {
      console.error(`Error encountered while retrieving messages from channel #${channel.name}`);
      console.error(error);
    }
  }
}