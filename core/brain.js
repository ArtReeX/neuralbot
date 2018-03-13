let brain = require("brain.js"),
    utilities = require("./utilities.js");

const config = {
    paths: {
        snapshot: "neuralnetwork.snapshot",
        dialogs: "initial.dialogs"
    },

    words: {
        inputs: 50,
        outputs: 50
    },

    network: {},

    train: {
        iterations: 100,
        errorThresh: 0.005,
        log: true,
        logPeriod: 10,
        learningRate: 0.3,
        momentum: 0.1,
        callback: null,
        callbackPeriod: 10,
        timeout: Infinity
    }
};

module.exports.initialize = async () => {
    try {
        let neuralNetwork = new brain.recurrent.LSTM(config.network.activation);

        if (await utilities.checkExistenceFile(config.paths.snapshot)) {
            neuralNetwork.fromJSON(
                JSON.parse(
                    await utilities.readFromFile(config.paths.snapshot, false)
                )
            );
        } else {
            await neuralNetwork.train(
                await createPatternsForTrains(),
                config.train
            );

            console.log("The neural network training has been completed.");
        }

        return neuralNetwork;
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
            JSON.stringify(neuralNetwork.toJSON()),
            true
        );
    } catch (error) {
        console.error(
            "Error of the neural network session termination. " +
                Error(error).message
        );
    }
};

module.exports.activate = async (string, neuralNetwork) => {
    try {
        return await utilities.arrayToString(
            neuralNetwork.run(await utilities.stringToArray(string))
        );
    } catch (error) {
        console.error(
            "It is impossible to activate the neural network. " +
                Error(error).message
        );
    }
};

var createPatternsForTrains = async () => {
    try {
        var dialogs = (await utilities.readFromFile(
                config.paths.dialogs,
                true
            )).split("\r\n"),
            countDialogs = 0,
            patterns = [];

        for (count = 0; count < dialogs.length; count++) {
            if (
                !dialogs[count]
                    .trim()
                    .replace("[^ a-z A-Z а-я А-Я 0-9 , ! ? .]")
            ) {
                dialogs.splice(count, 1);
            }
        }

        for (
            countPatterns = 0;
            countPatterns < dialogs.length / 2;
            countPatterns++
        ) {
            patterns.push({
                input: await utilities.stringToArray(
                    await utilities.clearText(dialogs[countDialogs])
                ),
                output: await utilities.stringToArray(
                    await utilities.clearText(dialogs[countDialogs + 1])
                )
            });

            countDialogs += 2;
        }

        return patterns;
    } catch (error) {
        console.error(
            "Could not create template for training. " + Error(error).message
        );
    }
};
