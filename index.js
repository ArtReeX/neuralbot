// подключение необходимых модулей
const readline = require('readline');
const log = require('log4js').getLogger();
const brain = require('./core/brain.js');

log.level = 'trace';

(() => {
  try {
    // инициализация нейронной сети
    const neuralNetwork = brain.initialize();

    // создание интерфейса командной строки
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.on('line', async (question) => {
      if (question) {
        log.info(brain.activate(question, neuralNetwork));
      }
    });

    // завершение работы нейронной сети
    brain.completion(neuralNetwork);
  } catch (error) {
    log.error(`Error starting neural network. ${error.message}`);
  }
})();
