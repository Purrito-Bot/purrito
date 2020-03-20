import { parseDiceMaidenMessage } from '../../DiceMaiden/ParseDiceMaiden'

test('Username is correctly parsed', () => {

    const message = 'example_player Roll: [20], [11] Result: 31'

    const result = parseDiceMaidenMessage(message)

    expect(result.parseSuccessful).toBeTruthy()
    expect(result.rollerName).toStrictEqual('example_player')
})

test('Total result is correctly parsed', () => {

    const message = 'example_player Roll: [20], [11] Result: 31'

    const result = parseDiceMaidenMessage(message)

    expect(result.parseSuccessful).toBeTruthy()
    expect(result.totalResult).toStrictEqual(31)
})

test('Dice rolls in different sets are correctly parsed', () => {

    const message = 'example_player Roll: [20], [11] Result: 31'

    const result = parseDiceMaidenMessage(message)


    expect(result.parseSuccessful).toBeTruthy()
    expect(result.diceRolls).toStrictEqual([20, 11])
})

test('Dice rolls in the same sets are correctly parsed', () => {

    const message = 'example_player Roll: [20, 11] Result: 31'

    const result = parseDiceMaidenMessage(message)

    expect(result.parseSuccessful).toBeTruthy()
    expect(result.diceRolls).toStrictEqual([20, 11])
})

test('Dice rolls in mixed sets are correctly parsed', () => {

    const message = 'example_player Roll: [20, 18], [11] Result: 31'

    const result = parseDiceMaidenMessage(message)

    expect(result.parseSuccessful).toBeTruthy()
    expect(result.diceRolls).toStrictEqual([20, 18, 11])
})

test('Dice rolls in mixed sets are correctly parsed when username has square braces', () => {

    const message = 'example_player[420] Roll: [20, 18], [11] Result: 31'

    const result = parseDiceMaidenMessage(message)

    expect(result.parseSuccessful).toBeTruthy()
    expect(result.diceRolls).toStrictEqual([20, 18, 11])
})