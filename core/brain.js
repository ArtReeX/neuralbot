const brainModule = require('brain.js');
const configModule = require('./config.js');
const utilitiesModule = require('./utilities.js');
const dictionaryModule = require('./dictionary.js');
const logModule = require('log4js').getLogger();

// уровень отладки
logModule.level = 'trace';

// глобальные переменные
let DICTIONARY;
let NETWORK;

// функция сохранения нейронной сети
const saveNetwork = (path, network) => {
  try {
    // запись образа словаря в файл
    utilitiesModule.writeToFile(path, JSON.stringify(network), true);
  } catch (error) {
    throw new Error(`Failed to saving neural network. ${error.message}`);
  }
};

/*
// функция создания примеров для обучения
const createPatternsForTrains = (dialogs, dictionary) => {
  try {
    logModule.debug('The creation of a training template was started.');

    const patterns = [];
    const dialogsContent = [];
    const countDialogs = 0;

    for (let count = 0; count < dialogs.length; count += 1) {
      if (utilities.clearText(dialogs[count])) {
        dialogsContent.push(utilities.clearText(dialogs[count]));
      }
    }

    for (let count = 0; count < dialogsContent.length / 2; count += 1) {
      patterns.push({
        input: utilities.stringToArray(dialogsContent[countDialogs]),
        output: utilities.stringToArray(dialogsContent[countDialogs + 1]),
      });

      countDialogs += 2;
    }

    logModule.debug('Finally create a training template.');

    return patterns;
  } catch (error) {
    throw new Error(`Could not create template for training. ${error.message}`);
  }
}; */

// функция обучения нейронной сети
const trainNeuralNetwork = (network, dialogs, dictionary, config) => {
  try {
    // создание примеров для обучения
    const patterns = createPatternsForTrains(dialogs, dictionary);
    // запуск обучения
    network.train(patterns, config);

    return network;
  } catch (error) {
    throw new Error(`Failed training neural network. ${error.message}`);
  }
};

// функция инициализации нейронной сети
const initializeNetwork = (pathNetwork, pathDialogs, dictionary, configTraining) => {
  try {
    // создание нейронной сети
    const network = new brainModule.recurrent.LSTM();

    // проверка существования необходимых образов
    if (utilitiesModule.checkExistenceFile(pathNetwork)) {
      // считывание нейронной сети из файла
      const snapshot = JSON.parse(utilitiesModule.readFromFile(pathNetwork, false));
      // загрузка образа в нейронную сеть
      network.fromJSON(snapshot);

      return network;
    }

    // считывание диалогов
    const dialogs = utilitiesModule.readFromFile(pathDialogs, false);
    // обучение нейронной сети
    trainNeuralNetwork(network, dialogs, dictionary, configTraining);
    // создание образа нейронной сети
    const snapshot = network.toJSON();
    // запись образа словаря в файл
    saveNetwork(pathNetwork, snapshot);

    return network;
  } catch (error) {
    throw new Error(`Failed to initialize neural network. ${error.message}`);
  }
};


// функция инициализации программы
module.exports.initialize = () => {
  try {
    // инициализация словаря
    const dictionaryPath = configModule.dictionary.path;
    const dialogsPath = configModule.dialogs.path;
    DICTIONARY = dictionaryModule.initialize(dictionaryPath, dialogsPath);
    // инициализация нейронной сети
    const configN = configModule.network;
    const configD = configModule.dialogs;
    NETWORK = initializeNetwork(configN.path, configD.path, DICTIONARY, configN.training);
  } catch (error) {
    throw new Error(`Failed to initialize neural network. ${error.message}`);
  }
};

// функция завершения работы программы
module.exports.completion = () => {
  try {
    // сохранение словаря
    dictionaryModule.save(configModule.dictionary.path, DICTIONARY);
    // сохранение нейронной сети
    saveNetwork(configModule.network.path, NETWORK);
  } catch (error) {
    throw new Error(`Failed to initialize neural network. ${error.message}`);
  }
};
