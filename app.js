import slackBolt from '@slack/bolt';
import { readLastRunTime, writeLastRunTime } from './lastRun.js';
import { getChannels, getMessages, getReplies, getPermalinkForMessage, publishMessage } from './messageHandler.js';
import { getUserById } from './userUtils.js';

/**
 * Andreid
 */

// initializes the app with bot token and app token
const app = new slackBolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

const sourceChannelList = [
  'starsweb-developer-support',
  'starsweb-prodissues'
];

const destinationChannelList = [
  'int-client-tech-web-platform-frontier',
  'andreid-test'
];

/* const tagList = [
  'Jerry Hu',
  'Tim Girard',
  'ryanlato'
]; */

const tagList = [
  'U09GPRS28QP',
  'U05HLRYQ8V6',
  'U05GX3Z2QD8'
];

// listens to incoming messages that contain "hello/hi/hey Andreid"
app.message(new RegExp('^(h|H)((e|E)(l|L){2}(o|O)|(i|I)|(e|E)(y|Y)) Andreid$'), async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there <@${message.user}>! Click on the button to start :)`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "START"
          },
          "action_id": "button_start_click"
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  });
});

app.action('button_start_click', async ({ body, ack, say }) => {
  // acknowledge the action
  await ack();
  await say(`<@${body.user.id}> started the function`);

  // manage timestamps
  const lastRunTime = readLastRunTime();
  await say(`Last run was at ${lastRunTime.toLocaleString()}`);
  const nowTime = new Date();
  writeLastRunTime(nowTime);
  await say(`Starting new run at ${nowTime.toLocaleString()}`);

  // get user IDs to search as tags
  let mentionMatchList = [];
  /* for (let id of tagList) {
    const userInfo = await getUserById(app, id);
    if (userInfo) {
      mentionMatchList.push(userInfo.name);
    }
  } */
  mentionMatchList = tagList.map((userId) => {
    return `<@${userId}>`;
  });
  console.log(`The user mention match list is ${mentionMatchList}`);

  // get source channels
  const srcChannels = await getChannels(sourceChannelList);
  console.log(`There are ${srcChannels.length} source channel(s) found`);

  // get destination channels
  const destChannels = await getChannels(destinationChannelList);
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

      // filter messages
      messagesInChannel = messagesInChannel.filter((message) => {
        const matchList = mentionMatchList.filter((tag) => message.text.includes(tag));
        return matchList.length > 0;
      });

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
});

// start app
(async () => {
  await app.start(process.env.PORT || 3000);
  app.logger.info('⚡️ Bolt app Andreid is running!');
})();
