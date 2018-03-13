let brain = require("brain.js"),
    utilities = require("./utilities.js");

const config = {
    paths: {
        snapshot: "neuralnetwork.snapshot",
        dictionary: "dialogs.dictionary",
        initialDialogs: "./train/initial.dialogs",
        encodedDialogs: "./train/encoded.dialogs"
    },

    network: {
        inputs: 50,
        hiddens: 50,
        outputs: 50
    }
};

module.exports.initialize = async () => {
    try {
        let neuralNetwork = new brain.recurrent.LSTM();

        if (await utilities.checkExistenceFile(config.paths.snapshot)) {
            neuralNetwork.fromJSON(
                JSON.parse(
                    await utilities.readFromFile(config.paths.snapshot, false)
                )
            );
        } else {
            console.log("Beginning of neural network training.");

            await createDictionary();

            console.log("The neural network training has been completed.");
        }

        return {
            network: neuralNetwork,
            dictionary: JSON.parse(
                await utilities.readFromFile(config.paths.dictionary, true)
            )
        };
    } catch (error) {
        console.error(
            "Failed to initialize neural network. " + Error(error).message
        );
    }
};

module.exports.completion = async neuralNetwork => {
    try {
        await utilities.writeToFile(
            config.paths.snapshot,
            neuralNetwork.toJSON(),
            true
        );
    } catch (error) {
        console.error(
            "Error of the neural network session termination. " +
                Error(error).message
        );
    }
};

var createDictionary = async () => {
    try {
        dialogs = (await utilities.readFromFile(
            config.paths.initialDialogs,
            true
        )).split("\r\n");

        var dictionary = {};

        await dialogs.forEach(async sentense => {
            words = (await utilities.clearText(sentense)).split(" ");

            await words.forEach(async word => {
                dictionary[word] = (Math.random() * (0 - 1) + 1).toFixed(64);
            });
        });

        await utilities.writeToFile(config.paths.dictionary, dictionary, true);
    } catch (error) {
        console.error("Error creating dictionary. " + Error(error).message);
    }
};
