/* globals describe, it, expect */

const utilitiesModule = require('../core/utilities');

// проверка утилит для работы с текстом
describe('text', () => {
  // проверка функции очистки текста
  it('clearText', () => {
    const sourceString = '" Привет,  как твои дела? /';
    const finalString = 'ПРИВЕТ КАК ТВОИ ДЕЛА';
    expect(utilitiesModule.clearString(sourceString)).toEqual(finalString);
  });
});

// проверка утилит для работы с файлами
describe('files', () => {
  // проверка функций записи, существования, чтения
  it('write-exist-read', () => {
    const data = { test: 123 };
    const path = './spec/temp/test.test';

    expect(utilitiesModule.writeToFile(path, JSON.stringify(data), true)).not.toBe(Error());
    expect(utilitiesModule.checkExistenceFile(path)).toBe(true);
    expect(JSON.parse(utilitiesModule.readFromFile(path, false))).toEqual(data);
  });
});
