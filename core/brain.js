let brain = require("brain.js"),
  utilities = require("./utilities.js");

const config = {
  paths: {
    snapshot: "neuralnetwork.snapshot",
    dictionary: "dialogs.dictionary",
    dialogs: "initial.dialogs"
  },

  words: {
    inputs: 50,
    outputs: 50
  },

  network: {
    activation: "sigmoid",
    hiddenLayers: [100],
    learningRate: 0.3
  },

  train: {
    iterations: 200000,
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
    let neuralNetwork = new brain.recurrent.LSTM(config.network);

    if (await utilities.checkExistenceFile(config.paths.snapshot)) {
      neuralNetwork.fromJSON(
        JSON.parse(await utilities.readFromFile(config.paths.snapshot, false))
      );
    } else {
      console.log("Beginning of neural network training.");

      await createDictionary();

      await neuralNetwork.train(await createPatternsForTrains(), config.train);

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
      JSON.stringify(neuralNetwork.toJSON()),
      true
    );
  } catch (error) {
    console.error(
      "Error of the neural network session termination. " + Error(error).message
    );
  }
};

module.exports.activate = async (string, neuralNetwork, dictionary) => {
  return await utilities.codeArrayToString(
    neuralNetwork.run(await utilities.stringToCodeArray(string, dictionary))
  );
};

var createDictionary = async () => {
  try {
    dialogs = (await utilities.readFromFile(config.paths.dialogs, true)).split(
      "\r\n"
    );

    var dictionary = {};

    for (countDialogs = 0; countDialogs < dialogs.length; countDialogs++) {
      var words = (await utilities.clearText(dialogs[countDialogs])).split(" ");

      for (wordsCount = 0; wordsCount < words.length; wordsCount++) {
        dictionary[words[wordsCount]] = (Math.random() * (0 - 1) + 1).toFixed(
          32
        );
      }

      await words.forEach(async word => {});
    }

    await utilities.writeToFile(
      config.paths.dictionary,
      JSON.stringify(dictionary),
      true
    );
  } catch (error) {
    console.error("Error creating dictionary. " + Error(error).message);
  }
};

var createPatternsForTrains = async () => {
  try {
    var dictionary = JSON.parse(
        await utilities.readFromFile(config.paths.dictionary, false)
      ),
      dialogs = (await utilities.readFromFile(
        config.paths.dialogs,
        true
      )).split("\r\n"),
      countDialogs = 0,
      patterns = [];

    for (
      countPatterns = 0;
      countPatterns < dialogs.length / 2;
      countPatterns++
    ) {
      patterns.push({
        input: await utilities.stringToCodeArray(
          await utilities.clearText(dialogs[countDialogs]),
          dictionary,
          config.words.inputs
        ),
        output: await utilities.stringToCodeArray(
          await utilities.clearText(dialogs[countDialogs + 1]),
          dictionary,
          config.words.outputs
        )
      });

      return patterns;
    }
    console.log(patterns);
    return patterns;
  } catch (error) {
    console.error(
      "Could not create template for training. " + Error(error).message
    );
  }
};
