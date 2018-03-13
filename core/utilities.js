let fs = require("fs");

module.exports.clearText = async string => {
  try {
    return string.trim().replace("[^ a-z A-Z а-я А-Я 0-9 , ! ? .]");
  } catch (error) {
    console.error("Unable to clear text. " + Error(error).message);
  }
};

module.exports.readFromFile = async (path, autoCreate) => {
  try {
    if (!fs.existsSync(path) && autoCreate) {
      fs.writeFileSync(path, "", null, "utf8");
    }
    return fs.readFileSync(path, "utf8");
  } catch (error) {
    console.error(
      "Could not read data from file [" + path + "]. " + Error(error).message
    );
  }
};

module.exports.writeToFile = async (path, data, overwrite) => {
  try {
    fs.writeFileSync(path, data, { flag: overwrite ? "w" : "a" }, "utf8");
  } catch (error) {
    console.error(
      "Could not write to the file [" + path + "]. " + Error(error).message
    );
  }
};

module.exports.checkExistenceFile = async path => {
  try {
    return fs.existsSync(path);
  } catch (error) {
    console.error(
      "Could not determine the existence of the file [" +
        path +
        "]. " +
        Error(error).message
    );
  }
};

module.exports.stringToCodeArray = async (string, dictionary, size) => {
  try {
    var words = (await this.clearText(string)).split(" ");

    var array = [];

    for (count = 0; count < words.length; count++) {
      if (count < size) {
        array.push(dictionary[words[count]]);
      }
    }

    for (count = array.length; count < size; count++) {
      array.push(0);
    }

    return array;
  } catch (error) {
    console.error(
      "Could not convert string to array of codes. " + Error(error).message
    );
  }
};

module.exports.codeArrayToString = async (array, dictionary) => {
  try {
    let string = "";

    for (arrayCount = 0; arrayCount < array.length; arrayCount++) {
      for (
        dictionaryCount = 0;
        dictionaryCount < dictionary.length;
        dictionaryCount++
      ) {
        if (dictionaryCount == array[arrayCount]) {
          string += dictionary[dictionaryCount] + " ";
        }
      }
    }

    return await this.clearText(string);
  } catch (error) {
    console.error(
      "Could not convert array of codes to string. " + Error(error).message
    );
  }
};
