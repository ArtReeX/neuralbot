/* globals describe, it, expect */

const dictionaryModule = require('../core/dictionary');

// проверка утилит для работы со словарём
describe('utilities', () => {
  // проверка функции существования слова в словаре
  it('checkExistByWord', () => {
    const dictionaryTemp = { mom: 123, dad: 456 };
    expect(dictionaryModule.checkExistByWord('mom', dictionaryTemp)).toBe(true);
    expect(dictionaryModule.checkExistByWord('grandpa', dictionaryTemp)).toBe(false);
  });

  // проверка функции создания словаря
  it('createDictionary', () => {
    const dialog = `
      Hi.
      Hello!
      How are you?
      I fine.
    `;

    const dictionaryImage = dictionaryModule.createDiactionary(dialog);

    expect(dictionaryImage.HI).not.toBe(undefined);
    expect(dictionaryImage.HI).toBeLessThan(1);
    expect(dictionaryImage.HI).toBeGreaterThan(-1);

    expect(dictionaryImage.HELLO).not.toBe(undefined);
    expect(dictionaryImage.HELLO).toBeLessThan(1);
    expect(dictionaryImage.HELLO).toBeGreaterThan(-1);
  });

  // проверка функции получения идентификатора слова
  it('getIdentifierByWord', () => {
    const dictionaryImage = { one: -0.97, two: 0.59 };

    expect(dictionaryModule.getIdentifierByWord('one', dictionaryImage)).not.toBe(Error());
    expect(dictionaryModule.getIdentifierByWord('one', dictionaryImage)).toBe(-0.97);
    expect(dictionaryModule.getIdentifierByWord('two', dictionaryImage)).not.toBe(Error());
    expect(dictionaryModule.getIdentifierByWord('two', dictionaryImage)).toBe(0.59);
  });

  // проверка функции получения слова по идентификатору
  it('getWordByIdentifier', () => {
    const dictionaryImage = { one: -0.97, two: 0.59 };

    expect(dictionaryModule.getWordByIdentifier(-0.97, dictionaryImage)).not.toBe(Error());
    expect(dictionaryModule.getWordByIdentifier(-0.97, dictionaryImage)).toBe('one');
    expect(dictionaryModule.getWordByIdentifier(0.59, dictionaryImage)).not.toBe(Error());
    expect(dictionaryModule.getWordByIdentifier(0.59, dictionaryImage)).toBe('two');
  });
});
