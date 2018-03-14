const readline = require('readline');
const log = require('log4js').getLogger();
const brain = require('./core/brain');

log.level = 'trace';

(() => {
  try {
    const neuralNetwork = brain.initialize();

    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.on('line', async (question) => {
      if (question) {
        log.info(brain.activate(question, neuralNetwork));
      }
    });

    brain.completion(neuralNetwork);
  } catch (error) {
    log.error(`Error starting neural network. ${error.message}`);
  }
})();
