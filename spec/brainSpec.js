const brain = require('../core/brain');

describe('brain', () => {
  it('createPatternsForTrains', () => {
    const dialogs = ['\t Привет, как дела?', 'Привет, хорошо! ^', '', 'Завтра дует снег? \ |  ', 'Да, будет.  '];
    const answer = [{ input: ['ПРИВЕТ~', 'КАК~', 'ДЕЛА~'], output: ['ПРИВЕТ~', 'ХОРОШО~'] }, { input: ['ЗАВТРА~', 'ДУЕТ~', 'СНЕГ~'], output: ['ДА~', 'БУДЕТ~'] }];
    expect(brain.createPatternsForTrains(dialogs)).toEqual(answer);
  });
});
