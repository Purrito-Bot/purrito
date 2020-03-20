import { DiceMaidenResult } from '../../src/DiceMaiden/DiceMaidenResult'

describe('DiceMaidenResult', () => {
    let dummyResult: DiceMaidenResult
    beforeEach(() => {
        dummyResult = new DiceMaidenResult()
        dummyResult.diceRolls = [20, 11]
        dummyResult.parseSuccessful = true
        dummyResult.rollerName = 'test_user'
        dummyResult.totalResult = 31
    })
    it('Should successfully report natural 20s', () => {
        expect(dummyResult.hasNatural20()).toBeTruthy()
    })

    it('Should successfully report lack of natural 20s', () => {
        dummyResult.diceRolls = [10, 10]
        dummyResult.totalResult = 20
        expect(dummyResult.hasNatural20()).toBeFalsy()
    })
})
