// подключение необходимых модулей
const readlineModule = require('readline');
const logModule = require('log4js').getLogger();
const brainModule = require('./core/brain.js');

logModule.level = 'trace';

(() => {
  try {
    // инициализация программы
    brainModule.initialize();

    // создание интерфейса командной строки
    const reader = readlineModule.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.on('line', async (question) => {
      if (question) {
        logModule.info(brainModule.activate(question));
      }
    });

    // завершение работы программы
    brainModule.completion();
  } catch (error) {
    logModule.error(`Error starting neural network. ${error.message}`);
  }
})();
