const readline = require('readline');
const logger = require('log4js').getLogger();
const brain = require('./core/brain');

(async () => {
  try {
    const neuralNetwork = await brain.initialize();

    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.on('line', async (question) => {
      if (question) {
        logger.log(await brain.activate(question, neuralNetwork));
      }
    });

    await brain.completion(neuralNetwork);
  } catch (error) {
    logger.error(`Error starting neural network. ${error.message}`);
  }
})();
