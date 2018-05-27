// параметры словаря
module.exports.dictionary = {
  path: 'dialogs.dictionary',
};

// параметры диалогов
module.exports.dialogs = {
  path: 'initial.dialogs',
};

// параметры нейронной сети
module.exports.network = {
  path: 'network.snapshot',

  // параметры обучения
  training: {
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
