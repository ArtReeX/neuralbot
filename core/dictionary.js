const utilitiesModule = require('./utilities.js');

// функция разделения текста на реплики
const textToString = text => text.split('\r\n');

// функция генерации уникального идентификатора
const createIdentificator = (min, max) => ((Math.random() * (max - min)) + min).toFixed(32);

// функция проверки слова внутри словаря по идентификатору
module.exports.checkExistByWord = (word, dictionary) => {
  try {
    if (typeof dictionary[`${word}`] !== 'undefined') {
      return true;
    }

    return false;
  } catch (error) {
    throw new Error(`Dictionary check error. ${error.message}`);
  }
};

// функция возврата идентификатора слова
module.exports.getIdentifierByWord = (word, dictionary) => {
  try {
    if (typeof dictionary[`${word}`] !== 'undefined') {
      return dictionary[`${word}`];
    }

    throw new Error(`The word does not exist in the dictionary. ${word}`);
  } catch (error) {
    throw new Error(`Error returning word identifier. ${error.message}`);
  }
};

// функция возврата слова по идентификатору
module.exports.getWordByIdentifier = (id, dictionary) => {
  try {
    const keys = Object.keys(dictionary);

    for (let count = 0; count < keys.length; count += 1) {
      if (dictionary[`${keys[count]}`] === id) {
        return keys[count];
      }
    }

    throw new Error(`An existing word identifier in the dictionary. ${id}`);
  } catch (error) {
    throw new Error(`Error returning word by ID. ${error.message}`);
  }
};

// функция создания словаря
module.exports.createDiactionary = (text) => {
  try {
    // создание хранилища уникальных слов
    const dictionary = {};

    // разделение диалога на реплики
    const dialog = textToString(text);

    // разделение реплик на уникальные слова
    for (let count = 0; count < dialog.length; count += 1) {
      // очистка текста
      dialog[count] = utilitiesModule.clearString(dialog[count]);
      // разделение реплики на слова
      dialog[count] = dialog[count].split(' ');
    }

    // заполнение хранилища уникальными словами
    for (let countString = 0; countString < dialog.length; countString += 1) {
      const string = dialog[countString];

      for (let countWord = 0; countWord < string.length; countWord += 1) {
        const word = string[countWord];

        // проверка на существования слова в словаре
        if (this.checkExistByWord(word, dictionary) === false) {
          dictionary[`${word}`] = createIdentificator(-1, 1);
        }
      }
    }

    return dictionary;
  } catch (error) {
    throw new Error(`Error creating dictionary. ${error.message}`);
  }
};

// функция сохранения словаря
module.exports.save = (path, dictionary) => {
  try {
    // запись образа словаря в файл
    utilitiesModule.writeToFile(path, JSON.stringify(dictionary), true);
  } catch (error) {
    throw new Error(`Failed to saving dictionary. ${error.message}`);
  }
};

// функция инициализации словаря
module.exports.initialize = (pathDictionary, pathDialogs) => {
  try {
    // проверка существования необходимых образов
    if (utilitiesModule.checkExistenceFile(pathDictionary)) {
      // считывание словаря с файла
      return JSON.parse(utilitiesModule.readFromFile(pathDictionary, false));
    }

    // считывание диалогов
    const dialogs = utilitiesModule.readFromFile(pathDialogs, false);
    // создание словаря
    const dictionary = this.createDiactionary(dialogs);
    // запись образа словаря в файл
    this.save(pathDictionary, dictionary);

    return dictionary;
  } catch (error) {
    throw new Error(`Failed to initialize dictionary. ${error.message}`);
  }
};
