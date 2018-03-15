const brain = require('brain.js');
const log = require('log4js').getLogger();
const utilities = require('./utilities.js');

log.level = 'trace';

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
    iterations: 50,
    errorThresh: 0.005,
    log: true,
    logPeriod: 5,
    learningRate: 0.3,
    momentum: 0.1,
    callback: null,
    callbackPeriod: 10,
    timeout: Infinity,
  },
};


const createPatternsForTrains = (dialogs) => {
  try {
    log.debug('The creation of a training template was started.');

    const patterns = [];
    const dialogsContent = [];
    let countDialogs = 0;

    for (let count = 0; count < dialogs.length; count += 1) {
      if (utilities.clearText(dialogs[count])) {
        dialogsContent.push(utilities.clearText(dialogs[count]));
      }
    }

    for (let count = 0; count < dialogsContent.length / 2; count += 1) {
      patterns.push({
        input: utilities.stringToArray(dialogsContent[countDialogs]),
        output: utilities.stringToArray(dialogsContent[countDialogs + 1]),
      });

      countDialogs += 2;
    }

    log.debug('Finally create a training template.');

    return patterns;
  } catch (error) {
    throw new Error(`Could not create template for training. ${error.message}`);
  }
};

module.exports.initialize = () => {
  try {
    const neuralNetwork = new brain.recurrent.LSTM(config.network);

    if (utilities.checkExistenceFile(config.paths.snapshot)) {
      const snapshot = utilities.readFromFile(config.paths.snapshot, false);
      neuralNetwork.fromJSON(JSON.parse(snapshot));
    } else {
      log.info('The training of the neural network was started.');

      neuralNetwork.train(createPatternsForTrains(utilities.readFromFile(config.paths.dialogs, true).split('\r\n')), config.train);

      log.info('The neural network training has been completed.');
    }

    return neuralNetwork;
  } catch (error) {
    throw new Error(`Failed to initialize neural network. ${error.message}`);
  }
};

module.exports.completion = (neuralNetwork) => {
  try {
    const snapshot = JSON.stringify(neuralNetwork.toJSON());
    utilities.writeToFile(config.paths.snapshot, snapshot, true);
  } catch (error) {
    throw new Error(`Error of the neural network session termination. ${error.message}`);
  }
};

module.exports.activate = (string, neuralNetwork) => {
  try {
    return utilities.arrayToString(neuralNetwork.run(utilities.stringToArray(string)));
  } catch (error) {
    throw new Error(`It is impossible to activate the neural network. ${error.message}`);
  }
};
