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


// функция создания примеров для обучения
const createPatternsForTrains = (dialogs, dictionaryMod, dictionary) => {
  try {
    logModule.debug('The creation of a training template was started.');

    // хранилище примеров для обучения
    const patterns = [];
    // хранилище диалогов
    const dialogsContent = utilitiesModule.convertTextToReplicas(dialogs);

    // преобразование диалога в строки из слов
    const dialogFromWords = utilitiesModule.convertReplicasToWordsArray(dialogsContent);

    // преобразование строк из слов в идентификаторы
    const cWATI = utilitiesModule.convertWordsArrayToIdentifiers;
    const dialogFromIdentifiers = cWATI(dialogFromWords, dictionaryMod, dictionary);

    // счётчик для пар диалогов (вопрос/ответ)
    let countDialogs = 0;

    // преобразование диалога по типу "вопрос/ответ"
    for (let count = 0; count < dialogFromIdentifiers.length / 2; count += 1) {
      patterns.push({
        input: dialogFromIdentifiers[countDialogs],
        output: dialogFromIdentifiers[countDialogs + 1],
      });

      countDialogs += 2;
    }

    logModule.debug('Finally create a training template.');

    return patterns;
  } catch (error) {
    throw new Error(`Could not create template for training. ${error.message}`);
  }
};

// функция обучения нейронной сети
const trainNeuralNetwork = (network, dialogs, dictionaryMod, dictionary, config) => {
  try {
    // создание примеров для обучения
    const patterns = createPatternsForTrains(dialogs, dictionaryModule, dictionary);
    // запуск обучения
    network.train(patterns, config);

    return network;
  } catch (error) {
    throw new Error(`Failed training neural network. ${error.message}`);
  }
};

// функция инициализации нейронной сети
const initializeNetwork = (pathNetwork, pathDialogs, dictionaryMod, dictionary, configTraining) => {
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
    trainNeuralNetwork(network, dialogs, dictionaryModule, dictionary, configTraining);
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
    const dM = dictionaryModule;
    NETWORK = initializeNetwork(configN.path, configD.path, dM, DICTIONARY, configN.training);
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

// функция преобразования ответа нейронной сети в массив идентификаторов
module.exports.convertOutputToArrayIdentifier = (string) => {
  try {
    let cleanOutputString;

    // очистка всех символов кроме разрешённых
    cleanOutputString = string.replace(/stop-input|start-output/g, ' ');
    // очистка нескольких спецсимволов подрят
    cleanOutputString = cleanOutputString.replace(/\s+/g, ' ');
    // преобразование строки в массив
    const arrayWitchIdentifiers = cleanOutputString.split(' ');

    return arrayWitchIdentifiers;
  } catch (error) {
    throw new Error(`It is impossible to convert the output string of a neural network to an array of identifiers. ${error.message}`);
  }
};

// функция активации (обработки) нейронной сети
module.exports.activate = (inputString) => {
  try {
    // разделение строки по словам
    const replicas = utilitiesModule.convertTextToReplicas(inputString);

    // преобразование строки в массив идентификаторов
    const cWATI = utilitiesModule.convertWordsArrayToIdentifiers;
    const inputArrayFromIdentifier = cWATI(replicas, dictionaryModule, DICTIONARY)[0];

    // преобразование ответа в массив идентификаторов
    const cOTAI = this.convertOutputToArrayIdentifier;
    const outputArrayFromIdentifier = cOTAI(NETWORK.run(inputArrayFromIdentifier));

    // преобразования массива идентификаторов в строку
    const cIATS = utilitiesModule.convertIdentifiersArrayToString;
    const outputString = cIATS(outputArrayFromIdentifier, dictionaryModule, DICTIONARY);

    return outputString;
  } catch (error) {
    // return 'Простите, к сожалению я пока не знаю как ответить на этот вопрос. Но со временем обязательно научусь.';
    throw new Error(`It is impossible to activate the neural network. ${error.message}`);
  }
};
