const brain = require('brain.js');
const log = require('log4js').getLogger();
const utilities = require('./utilities.js');

const config = {
  paths: {
    snapshot: 'neuralnetwork.snapshot',
    dialogs: 'initial.dialogs',
  },

  words: {
    inputs: 50,
    outputs: 50,
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
    timeout: Infinity,
  },
};


const createPatternsForTrains = async () => {
  try {
    const dialogs = (await utilities.readFromFile(config.paths.dialogs, true)).split('\r\n');
    let countDialogs = 0;
    const patterns = [];

    for (let count = 0; count < dialogs.length; count += 1) {
      if (!dialogs[count].trim().replace('[^ a-z A-Z а-я А-Я 0-9 , ! ? .]')) {
        dialogs.splice(count, 1);
      }
    }

    for (let countPatterns = 0; countPatterns < dialogs.length / 2; countPatterns += 1) {
      patterns.push({
        input: utilities.stringToArray(utilities.clearText(dialogs[countDialogs])),
        output: utilities.stringToArray(utilities.clearText(dialogs[countDialogs + 1])),
      });

      countDialogs += 2;
    }

    return Promise.all(patterns);
  } catch (error) {
    throw new Error(`Could not create template for training. ${error.message}`);
  }
};

module.exports.initialize = async () => {
  try {
    const neuralNetwork = new brain.recurrent.LSTM(config.network.activation);

    if (await utilities.checkExistenceFile(config.paths.snapshot)) {
      const snapshot = await utilities.readFromFile(config.paths.snapshot, false);
      neuralNetwork.fromJSON(JSON.parse(snapshot));
    } else {
      log.info('The training of the neural network was started.');

      await neuralNetwork.train(await createPatternsForTrains(), config.train);

      log.info('The neural network training has been completed.');
    }

    return neuralNetwork;
  } catch (error) {
    throw new Error(`Failed to initialize neural network. ${error.message}`);
  }
};

module.exports.completion = async (neuralNetwork) => {
  try {
    const snapshot = JSON.stringify(neuralNetwork.toJSON());
    await utilities.writeToFile(config.paths.snapshot, snapshot, true);
  } catch (error) {
    throw new Error(`Error of the neural network session termination. ${error.message}`);
  }
};

module.exports.activate = async (string, neuralNetwork) => {
  try {
    return await utilities.arrayToString(neuralNetwork.run(await utilities.stringToArray(string)));
  } catch (error) {
    throw new Error(`It is impossible to activate the neural network. ${error.message}`);
  }
};
