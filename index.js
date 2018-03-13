let brain = require("./core/brain");

(async () => {
    try {
        var neuralNetwork = await brain.initialize();
        await brain.completion(neuralNetwork.network);
    } catch (error) {
        console.error("Error starting neural network. " + Error(error).message);
    }
})();
