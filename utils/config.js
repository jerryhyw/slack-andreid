import fs from 'fs';

const CONFIG_FILENAME = 'config.json';

const DEFAULT_SOURCE = [
  'starsweb-developer-support',
  'starsweb-prodissues'
];

const DEFAULT_DESTINATION = [
  'int-client-tech-web-platform-frontier'
];

const DEFAULT_TAGS = [
  'U09GPRS28QP', // Jerry Hu
  'U05HLRYQ8V6', // Tim Girard
  'U05GX3Z2QD8' // ryanlato
];

export const readConfig = () => {
  try {
    return configStringToArray(JSON.parse(fs.readFileSync(CONFIG_FILENAME)));
  } catch (error) {
    console.error('Error encountered while reading from config.json\n' + error);
    return configStringToArray(JSON.parse(getDefaultConfigJsonString()));
  }
}

export const writeConfig = (configObj) => {
  try {
    const configString = JSON.stringify(configObj);
    fs.writeFile(CONFIG_FILENAME, '' + currTime, (err) => {
      if (err) console.error(err);
    });
  } catch (error) {
    console.error("Error encountered while writing to config.json\n" + error);
  }
}

const getDefaultConfigJsonString = () => {
  const defaultConfig = {};
  defaultConfig.source = DEFAULT_SOURCE.join(",");
  defaultConfig.destination = DEFAULT_DESTINATION.join(",");
  defaultConfig.tags = DEFAULT_TAGS.join(",");
  return JSON.stringify(defaultConfig);
}

const configStringToArray = (config) => {
  const result = {};
  result.source = stringToArray(config.source);
  result.destination = stringToArray(config.destination);
  result.tags = stringToArray(config.tags);
  return result;
}

const stringToArray = (str) => {
  if (str) {
    return str.split(",");
  } else {
    return [];
  }
}
