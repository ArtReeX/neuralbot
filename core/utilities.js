const fs = require('fs');

module.exports.clearText = (string) => {
  try {
    return string.trim().replace('[^ a-z A-Z а-я А-Я 0-9 , ! ? .]', '');
  } catch (error) {
    throw new Error(`Unable to clear text. ${error.message}`);
  }
};

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

module.exports.writeToFile = (path, data, overwrite) => {
  try {
    fs.writeFileSync(path, data, { flag: overwrite ? 'w' : 'a' }, 'utf8');
  } catch (error) {
    throw new Error(`Could not write to the file [${path}]. ${error.message}`);
  }
};

module.exports.checkExistenceFile = (path) => {
  try {
    return fs.existsSync(path);
  } catch (error) {
    throw new Error(`Could not determine the existence of the file [${path}]. ${error.message}`);
  }
};

module.exports.stringToArray = (string) => {
  try {
    const words = this.clearText(string).split(' ');

    for (let count = 0; count < words.length; count += 1) {
      words[count] += '^';
    }

    return words;
  } catch (error) {
    throw new Error(`Could not convert string to array of codes. ${error.message}`);
  }
};

module.exports.arrayToString = (array) => {
  try {
    let string = '';

    for (let count = 0; count < array.length; count += 1) {
      string += array[count];
    }

    return this.clearText(string.replace(/\^/g, ' ').replace(/start-output/g, '').replace(/stop-input/g, ''));
  } catch (error) {
    throw new Error(`Could not convert array of codes to string. ${error.message}`);
  }
};
