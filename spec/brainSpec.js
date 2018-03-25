const brain = require('../core/brain');

describe('brain', () => {
  it('createPatternsForTrains', () => {
    const dialogs = ['\t Привет, как дела?', 'Привет, хорошо! ^', '  ', 'Завтра будет снег? // |  ', 'Да, будет.  '];
    const answer = [{ input: ['ПРИВЕТ~', 'КАК~', 'ДЕЛА~'], output: ['ПРИВЕТ~', 'ХОРОШО~'] }, { input: ['ЗАВТРА~', 'БУДЕТ~', 'СНЕГ~'], output: ['ДА~', 'БУДЕТ~'] }];
    expect(brain.createPatternsForTrains(dialogs)).toEqual(answer);
  });
});
