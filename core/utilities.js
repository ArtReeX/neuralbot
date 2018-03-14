const fs = require('fs');

module.exports.clearText = async (string) => {
  try {
    return string.trim().replace('[^ a-z A-Z а-я А-Я 0-9 , ! ? .]');
  } catch (error) {
    throw new Error(`Unable to clear text. ${error.message}`);
  }
};

module.exports.readFromFile = async (path, autoCreate) => {
  try {
    if (!fs.existsSync(path) && autoCreate) {
      fs.writeFileSync(path, '', null, 'utf8');
    }
    return fs.readFileSync(path, 'utf8');
  } catch (error) {
    throw new Error(`Could not read data from file [${path}]. ${error.message}`);
  }
};

module.exports.writeToFile = async (path, data, overwrite) => {
  try {
    fs.writeFileSync(path, data, { flag: overwrite ? 'w' : 'a' }, 'utf8');
  } catch (error) {
    throw new Error(`Could not write to the file [${path}]. ${error.message}`);
  }
};

module.exports.checkExistenceFile = async (path) => {
  try {
    return fs.existsSync(path);
  } catch (error) {
    throw new Error(`Could not determine the existence of the file [${path}]. ${error.message}`);
  }
};

module.exports.stringToArray = async (string) => {
  try {
    const words = (await this.clearText(string)).split(' ');

    for (let count = 0; count < words.length; count += 1) {
      words[count] += '^';
    }

    return words;
  } catch (error) {
    throw new Error(`Could not convert string to array of codes. ${error.message}`);
  }
};

module.exports.arrayToString = async (array) => {
  try {
    let string = '';

    for (let count = 0; count < array.length; count += 1) {
      string += array[count].replace('^', ' ');
    }

    return await this.clearText(string);
  } catch (error) {
    throw new Error(`Could not convert array of codes to string. ${error.message}`);
  }
};
