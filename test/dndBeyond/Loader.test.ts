import * as dndLoader from '../../src/dndBeyond/loader';

test('Character can be parsed', async () => {

    await dndLoader.loadCharacterFromId('24619518');

});

test('Character can be parsed from file', async () => {

    await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/solomon.json');

});

test('Solomon has correct stats', async () => {

    try {
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
    }
    catch (e) {
        console.log(e);
        throw e;
    }

});

test('Rho has correct stats', async () => {

    try {
        const solomonCharacter = await dndLoader.loadCharacterFromFilePath('./test/dndBeyond/jestJson/rho.json');

        expect(solomonCharacter.id).toStrictEqual(24253076);
        expect(solomonCharacter.name).toStrictEqual('Rho');
        expect(solomonCharacter.strength).toStrictEqual(16);
        expect(solomonCharacter.dexterity).toStrictEqual(15);
        expect(solomonCharacter.constitution).toStrictEqual(14);
        expect(solomonCharacter.intelligence).toStrictEqual(8);
        expect(solomonCharacter.wisdom).toStrictEqual(10);
        expect(solomonCharacter.charisma).toStrictEqual(13);
        expect(solomonCharacter.initiativeModifier).toStrictEqual(2);
    }
    catch (e) {
        console.log(e);
        throw e;
    }

});
