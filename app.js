import slackBolt from '@slack/bolt';

import { run } from './handlers/commandHandler.js';
import { deleteMessage } from './handlers/messageHandler.js';

import { readLastRunTime, writeLastRunTime } from './utils/timestamp.js';
import { readConfig, writeConfig } from './utils/config.js';
// import { getUserById } from './utils/user.js';

/**
 * Andreid Slack App
 */

// initializes the app with bot token and app token
const app = new slackBolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// listen to slask command "/andreid"
app.command('/andreid', async ({ command, ack, respond }) => {

  // acknowledge command request
  await ack();

  await respond(`Hi <@${command.user_id}>, I'm happy to help!`);

  switch (command.text) {
    case "run":
      await respond('Starting a new run...');

      // manage timestamps
      const lastRunTime = readLastRunTime();
      await respond(`Last run was at ${lastRunTime.toLocaleString()}`);
      const nowTime = new Date();
      writeLastRunTime(nowTime);
      await respond(`Starting new run at ${nowTime.toLocaleString()}`);

      // read config
      const config = {};

      // execute main messaging function
      run(lastRunTime, config);
      break;
    case "config":
      // read current config
      const currentConfig = readConfig();

      // launch config block UI
      await respond({
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": 'View or update the current configuration'
            }
          },
          {
            "type": "input",
            "block_id": "input_source",
            "label": {
              "type": "plain_text",
              "text": "Source Channels"
            },
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_input",
              "initial_value": `${currentConfig.source.join(',')}`
            }
          },
          {
            "type": "input",
            "block_id": "input_destination",
            "label": {
              "type": "plain_text",
              "text": "Destination Channels"
            },
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_input",
              "initial_value": `${currentConfig.destination.join(',')}`
            }
          },
          {
            "type": "input",
            "block_id": "input_tags",
            "label": {
              "type": "plain_text",
              "text": "Tags"
            },
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_input",
              "initial_value": `${currentConfig.tags.join(',')}`
            }
          },
          {
            "type": "actions",
            "block_id": "actions_save_cancel",
            "elements": [
              {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Save"
                },
                "value": "save",
                "action_id": "button_save_click"
              },
              {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Cancel"
                },
                "value": "cancel",
                "action_id": "button_cancel_click"
              }
            ]
          }
        ]
      });

      break;
    default:
      await respond('But you will need to input a valid option. Please try "run" or "config".');
  }
});

app.action('button_save_click', async ({ body, ack, say }) => {
  // acknowledge the action
  await ack();

  await say(`<@${body.user.id}> updated the configuration.`);
});

app.action('button_cancel_click', async ({ body, ack, say }) => {
  // acknowledge the action
  await ack();
  deleteMessage(body.container.channel_id, body.container.message_ts);
});

// listens to incoming messages that contain "hello/hi/hey Andreid"
app.message(new RegExp('^(h|H)((e|E)(l|L){2}(o|O)|(i|I)|(e|E)(y|Y)) Andreid$'), async ({ message, say }) => {
  await say(`Hi there <@${message.user}>!`);
  await say(`If you need anything, please try "/andreid [run/config]"`);
});

// start app
(async () => {
  await app.start(process.env.PORT || 3000);
  app.logger.info('⚡️ Bolt app Andreid is running!');
})();
