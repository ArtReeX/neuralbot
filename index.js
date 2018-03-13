const readline = require("readline"),
    brain = require("./core/brain");

(async () => {
    try {
        var neuralNetwork = await brain.initialize();

        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        reader.on("line", async question => {
            if (question) {
                console.log(await brain.activate(question, neuralNetwork));
            }
        });

        await brain.completion(neuralNetwork);
    } catch (error) {
        console.error("Error starting neural network. " + Error(error).message);
    }
})();
