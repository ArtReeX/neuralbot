/* globals describe, it, expect */

const utilities = require('../core/utilities');

// проверка утилит для работы с текстом
describe('text', () => {
  it('clearText', () => {
    const sourceString = '" Привет,  как твои дела? /';
    const finalString = 'Привет как твои дела';
    expect(utilities.clearString(sourceString)).toEqual(finalString);
  });
});

// проверка утилит для работы с файлами
describe('files', () => {
  it('write-exist-read', () => {
    const data = { test: 123 };
    const path = './spec/temp/test.test';

    expect(utilities.writeToFile(path, JSON.stringify(data), true)).not.toBe(Error());
    expect(utilities.checkExistenceFile(path)).toBe(true);
    expect(JSON.parse(utilities.readFromFile(path, false))).toEqual(data);
  });
});
