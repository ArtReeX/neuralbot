var brain = require("brain.js");

var net = new brain.recurrent.LSTM();

net.train(
    [
        { input: [0, 0], output: [0] },
        { input: [0, 1], output: [1] },
        { input: [1, 0], output: [1] },
        { input: [1, 1], output: [0] }
    ],
    {
        iterations: 20000,
        errorThresh: 0.005,
        log: true,
        logPeriod: 10,
        learningRate: 0.3,
        momentum: 0.1,
        callback: null,
        callbackPeriod: 10,
        timeout: Infinity
    }
);

var output = net.run([0, 0]); // [0]
output = net.run([0, 1]); // [1]
output = net.run([1, 0]); // [1]
output = net.run([1, 1]); // [0]

console.log(net.toJSON());
