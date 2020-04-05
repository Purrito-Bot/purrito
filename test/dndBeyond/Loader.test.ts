import * as dndLoader from '../../src/dndBeyond/loader';

test('Character can be parsed', async () => {

    await dndLoader.loadCharacterFromId('24619518');

});

test('Character can be parsed from file', async () => {

    await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/solomon.json');

});

test('Solomon has correct stats', async () => {

    const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/solomon.json');

    expect(solomonCharacter.id).toStrictEqual(24619518);
    expect(solomonCharacter.name).toStrictEqual('Solomon Burton');
    expect(solomonCharacter.strength).toStrictEqual(10);
    expect(solomonCharacter.dexterity).toStrictEqual(16);
    expect(solomonCharacter.constitution).toStrictEqual(13);
    expect(solomonCharacter.intelligence).toStrictEqual(12);
    expect(solomonCharacter.wisdom).toStrictEqual(9);
    expect(solomonCharacter.charisma).toStrictEqual(15);
    expect(solomonCharacter.initiativeModifier).toStrictEqual(4);
});

test('Rho has correct stats', async () => {

    const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/rho.json');

    expect(solomonCharacter.name).toStrictEqual('Rho');
    expect(solomonCharacter.strength).toStrictEqual(16);
    expect(solomonCharacter.dexterity).toStrictEqual(15);
    expect(solomonCharacter.constitution).toStrictEqual(14);
    expect(solomonCharacter.intelligence).toStrictEqual(8);
    expect(solomonCharacter.wisdom).toStrictEqual(10);
    expect(solomonCharacter.charisma).toStrictEqual(13);
    expect(solomonCharacter.initiativeModifier).toStrictEqual(2);
});

test('Faylin has correct stats', async () => {

    const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/faylin.json');

    expect(solomonCharacter.name).toStrictEqual('Faylin');
    expect(solomonCharacter.strength).toStrictEqual(16);
    expect(solomonCharacter.dexterity).toStrictEqual(12);
    expect(solomonCharacter.constitution).toStrictEqual(13);
    expect(solomonCharacter.intelligence).toStrictEqual(10);
    expect(solomonCharacter.wisdom).toStrictEqual(8);
    expect(solomonCharacter.charisma).toStrictEqual(16);
    expect(solomonCharacter.initiativeModifier).toStrictEqual(1);
});

test('Irlykira has correct stats', async () => {

    const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/irlykira.json');

    expect(solomonCharacter.name).toStrictEqual('Irlykira');
    expect(solomonCharacter.strength).toStrictEqual(15);
    expect(solomonCharacter.dexterity).toStrictEqual(10);
    expect(solomonCharacter.constitution).toStrictEqual(14);
    expect(solomonCharacter.intelligence).toStrictEqual(14);
    expect(solomonCharacter.wisdom).toStrictEqual(12);
    expect(solomonCharacter.charisma).toStrictEqual(10);
    expect(solomonCharacter.initiativeModifier).toStrictEqual(0);
});

test('Regdrak has correct stats', async () => {

    const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/regdrak.json');

    expect(solomonCharacter.name).toStrictEqual('Regdrak');
    expect(solomonCharacter.strength).toStrictEqual(10);
    expect(solomonCharacter.dexterity).toStrictEqual(15);
    expect(solomonCharacter.constitution).toStrictEqual(13);
    expect(solomonCharacter.intelligence).toStrictEqual(12);
    expect(solomonCharacter.wisdom).toStrictEqual(10);
    expect(solomonCharacter.charisma).toStrictEqual(15);
    expect(solomonCharacter.initiativeModifier).toStrictEqual(2);
});

test('Takhat has correct stats', async () => {

    const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/takhat.json');

    expect(solomonCharacter.name).toStrictEqual('Takhat');
    expect(solomonCharacter.strength).toStrictEqual(10);
    expect(solomonCharacter.dexterity).toStrictEqual(8);
    expect(solomonCharacter.constitution).toStrictEqual(13);
    expect(solomonCharacter.intelligence).toStrictEqual(15);
    expect(solomonCharacter.wisdom).toStrictEqual(16);
    expect(solomonCharacter.charisma).toStrictEqual(13);
    expect(solomonCharacter.initiativeModifier).toStrictEqual(-1);
});

test('Vimak has correct stats', async () => {

    const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/vimak.json');

    expect(solomonCharacter.name).toStrictEqual('Vimak Katho-Olavi');
    expect(solomonCharacter.strength).toStrictEqual(17);
    expect(solomonCharacter.dexterity).toStrictEqual(8);
    expect(solomonCharacter.constitution).toStrictEqual(16);
    expect(solomonCharacter.intelligence).toStrictEqual(8);
    expect(solomonCharacter.wisdom).toStrictEqual(8);
    expect(solomonCharacter.charisma).toStrictEqual(15);
    expect(solomonCharacter.initiativeModifier).toStrictEqual(-1);
});
