const fs = require('fs');

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

    return cleanedString;
  } catch (error) {
    throw new Error(`Unable to clear text string. ${error.message}`);
  }
};

// функция чтения с файла
module.exports.readFromFile = (path, autoCreate) => {
  try {
    if (!fs.existsSync(path) && autoCreate) {
      fs.writeFileSync(path, '', null, 'utf8');
    }
    return fs.readFileSync(path, 'utf8');
  } catch (error) {
    throw new Error(`Could not read data from file [${path}]. ${error.message}`);
  }
};

// функция записи в файл
module.exports.writeToFile = (path, data, overwrite) => {
  try {
    fs.writeFileSync(path, data, { flag: overwrite ? 'w' : 'a' }, 'utf8');
  } catch (error) {
    throw new Error(`Could not write to the file [${path}]. ${error.message}`);
  }
};

// функция проверки существования файла
module.exports.checkExistenceFile = (path) => {
  try {
    return fs.existsSync(path);
  } catch (error) {
    throw new Error(`Could not determine the existence of the file [${path}]. ${error.message}`);
  }
};
