import { extractFlag } from '../src/utils'

describe('testing the extract flag function', () => {
    it('successfully extracts a valid flag', () => {
        // Setup
        const stringToTest = '!generate environment env mountain'
        const flagName = 'env'

        const expectedResult = 'mountain'

        // Test
        const actualResult = extractFlag(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(expectedResult)
    })

    it('returns undefined when the flag is not present', () => {
        // Setup
        const stringToTest = '!generate environment env mountain'
        const flagName = 'bob'

        // Test
        const actualResult = extractFlag(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(undefined)
    })

    it('does not grab extra flags when they prefix the one wanted', () => {
        // Setup
        const stringToTest = '!generate environment env mountain dif easy'
        const flagName = 'env'

        const expectedResult = 'mountain'

        // Test
        const actualResult = extractFlag(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(expectedResult)
    })
})
