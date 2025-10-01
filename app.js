import slackBolt from '@slack/bolt';
import { readLastRunTime, writeLastRunTime } from './lastRun.js';

/**
 * Andreid
 */

// Initializes your app with your bot token and app token
const app = new slackBolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Listens to incoming messages that contain "hello"
app.message(new RegExp('(h|H)((e|E)(l|L){2}(o|O)|(i|I)|(e|E)(y|Y))'), async ({ message, say }) => {
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
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> started the function`);
  const lastRunTime = readLastRunTime().toLocaleString();
  await say(`Last run was at ${lastRunTime}`);
  const nowTime = new Date();
  writeLastRunTime(nowTime);
  await say(`Starting new run at ${nowTime.toLocaleString()}`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('⚡️ Bolt app Andreid is running!');
})();
