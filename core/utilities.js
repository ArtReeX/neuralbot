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
        if (!await fs.existsSync(path) && autoCreate) {
            await fs.writeFileSync(path, "", null, "utf8");
        }
        return fs.readFileSync(path, "utf8");
    } catch (error) {
        console.error(
            "Could not read data from file [" +
                path +
                "]. " +
                Error(error).message
        );
    }
};

module.exports.writeToFile = async (path, data, overwrite) => {
    try {
        await fs.writeFileSync(
            path,
            await JSON.stringify(data),
            { flag: overwrite ? "w" : "a" },
            "utf8"
        );
        console.log(data);
        console.log(JSON.stringify(data));
    } catch (error) {
        console.error(
            "Could not write to the file [" +
                path +
                "]. " +
                Error(error).message
        );
    }
};

module.exports.checkExistenceFile = async path => {
    try {
        return await fs.existsSync(path);
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

        var array = new Array();

        await words.forEach(async (word, index) => {
            if (index < size) {
                array.push(dictionary.get(word));
            }
        });

        for (count = array.length; count < size; count++) {
            array.push(0);
        }

        return array;
    } catch (error) {
        console.error(
            "Could not convert string to array of codes. " +
                Error(error).message
        );
    }
};

module.exports.codeArrayToString = async (array, dictionary) => {
    try {
        let string = "";

        await array.forEach(async code => {
            await dictionary.forEach(async (key, word) => {
                if (key == code) {
                    string += word + " ";
                }
            });
        });

        return await this.clearText(string);
    } catch (error) {
        console.error(
            "Could not convert array of codes to string. " +
                Error(error).message
        );
    }
};
