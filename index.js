const readline = require('readline');
const log = require('log4js').getLogger();
const brain = require('./core/brain');

log.level = 'trace';

(async () => {
  try {
    const neuralNetwork = await brain.initialize();

    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.on('line', async (question) => {
      if (question) {
        log.info(await brain.activate(question, neuralNetwork));
      }
    });

    await brain.completion(neuralNetwork);
  } catch (error) {
    log.error(`Error starting neural network. ${error.message}`);
  }
})();
