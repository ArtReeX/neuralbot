const fsModule = require('fs');

// функция очистки текста от спецсимволов
module.exports.clearString = (string) => {
  try {
    let cleanedString = '';

    // пошаговое очищение строки

    // очистка всех символов кроме разрешённых
    cleanedString = string.replace(/[^a-z A-Z а-я А-Я 0-9]/g, '');
    // очистка нескольких спецсимволов подрят
    cleanedString = cleanedString.replace(/\s+/g, ' ');
    // очистка пробелов по краям
    cleanedString = cleanedString.trim();
    // преобразование в высокий текст
    cleanedString = cleanedString.toUpperCase();

    return cleanedString;
  } catch (error) {
    throw new Error(`Unable to clear text string. ${error.message}`);
  }
};

// функция разделения текста на реплики
module.exports.convertTextToReplicas = (text) => {
  try {
    return text.split('\r\n');
  } catch (error) {
    throw new Error(`It is impossible to divide the text into replicas. ${error.message}`);
  }
};

// функция разделения предложения по словам
module.exports.splitStringIntoWords = (string) => {
  try {
    return string.split(' ');
  } catch (error) {
    throw new Error(`It is impossible to divide the sentence into words. ${error.message}`);
  }
};

// функция преобразования реплик в слова
module.exports.convertReplicasToWordsArray = (replicas) => {
  try {
    // хранилище чистых строк
    const cleanReplicas = [];

    // взятие только чистых строк
    for (let count = 0; count < replicas.length; count += 1) {
      const cleanReplica = this.clearString(replicas[count]);
      // если строка не является пустой, добавляем её в хранилище
      if (cleanReplica) {
        cleanReplicas.push(this.splitStringIntoWords(cleanReplica));
      }
    }

    return cleanReplicas;
  } catch (error) {
    throw new Error(`It is not possible to convert a replica to an array of words. ${error.message}`);
  }
};

module.exports.convertWordsArrayToIdentifiers = (replicas, dictionaryModule, dictionary) => {
  try {
    // хранилище реплик из идентификаторов
    const replicasFromIdentifiers = [];

    for (let countReplica = 0; countReplica < replicas.length; countReplica += 1) {
      replicasFromIdentifiers.push([]);
      for (let countWord = 0; countWord < replicas[countReplica].length; countWord += 1) {
        const word = replicas[countReplica][countWord];
        // если слово присутствует в словаре, добавляем его в хранилище
        if (dictionaryModule.checkExistByWord(word, dictionary) === true) {
          const identifier = dictionaryModule.getIdentifierByWord(word, dictionary);
          replicasFromIdentifiers[countReplica].push(identifier);
        }
      }
    }

    return replicasFromIdentifiers;
  } catch (error) {
    throw new Error(`It is not possible to convert an array of words into identifiers. ${error.message}`);
  }
};

// функция преобразования массива идентификаторов в строку
module.exports.convertIdentifiersArrayToString = (array, dictionaryModule, dictionary) => {
  try {
    // хранилище для строки
    let string = '';

    for (let count = 0; count < array.length; count += 1) {
      const identifier = array[count];
      // если слово присутствует в словаре, добавляем его к строке
      string += `${dictionaryModule.getWordByIdentifier(identifier, dictionary)} `;
    }

    // очистка лишних символов в конце
    string.trim();

    return string;
  } catch (error) {
    throw new Error(`It is not possible to convert an array of identifiers into string. ${error.message}`);
  }
};

// функция чтения с файла
module.exports.readFromFile = (path, autoCreate) => {
  try {
    if (!fsModule.existsSync(path) && autoCreate) {
      fsModule.writeFileSync(path, '', null, 'utf8');
    }
    return fsModule.readFileSync(path, 'utf8');
  } catch (error) {
    throw new Error(`Could not read data from file [${path}]. ${error.message}`);
  }
};

// функция записи в файл
module.exports.writeToFile = (path, data, overwrite) => {
  try {
    fsModule.writeFileSync(path, data, { flag: overwrite ? 'w' : 'a' }, 'utf8');
  } catch (error) {
    throw new Error(`Could not write to the file [${path}]. ${error.message}`);
  }
};

// функция проверки существования файла
module.exports.checkExistenceFile = (path) => {
  try {
    return fsModule.existsSync(path);
  } catch (error) {
    throw new Error(`Could not determine the existence of the file [${path}]. ${error.message}`);
  }
};
