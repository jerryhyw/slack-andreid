import fs from 'fs';

const LAST_RUN_FILENAME = 'last-run.txt';

export const readLastRunTime = () => {
  const currTime = new Date().getTime();
  const currTimeMinus24H = currTime - 24 * 60 * 60 * 1000;

  try {
    const timeFile = fs.readFileSync(LAST_RUN_FILENAME);
    const lastRunTimeStr = timeFile.toString().trim();
    const lastRunTime = new Date(parseInt(lastRunTimeStr));
    if (lastRunTime.getTime() < currTimeMinus24H) {
      // last run was over 24H ago
      throw new Error();
    } else {
      return lastRunTime;
    }
  } catch {
    return new Date(currTimeMinus24H);
  }
};

export const writeLastRunTime = (date) => {
  try {
    const currTime = date.getTime() || new Date().getTime();
    fs.writeFile(LAST_RUN_FILENAME, '' + currTime, (err) => {
      if (err) console.error(err);
    });
  } catch (error) {
    console.error("Error encountered while writing time to file\n" + error.message);
  }
};
