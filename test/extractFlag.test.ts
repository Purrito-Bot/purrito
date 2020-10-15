import { extractFlagWord, extractFlagNumberList } from '../src/utils/flagUtils'

describe('testing the extract flag function', () => {
    it('successfully extracts a valid flag', () => {
        // Setup
        const stringToTest = '!generate encounter env mountain'
        const flagName = 'env'

        const expectedResult = 'mountain'

        // Test
        const actualResult = extractFlagWord(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(expectedResult)
    })

    it('returns undefined when the flag is not present', () => {
        // Setup
        const stringToTest = '!generate encounter env mountain'
        const flagName = 'bob'

        // Test
        const actualResult = extractFlagWord(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(undefined)
    })

    it('does not grab extra flags when they come after the one wanted', () => {
        // Setup
        const stringToTest = '!generate encounter env mountain dif easy'
        const flagName = 'env'

        const expectedResult = 'mountain'

        // Test
        const actualResult = extractFlagWord(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(expectedResult)
    })

    it('grab the number array when using the number array function, but ignore extra flags', () => {
        // Setup
        const stringToTest = '!generate encounter -p 1 2 3 -dif easy'
        const flagName = '-p'

        const expectedResult = [1, 2, 3]

        // Test
        const actualResult = extractFlagNumberList(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(expectedResult)
    })

    it('grab the number array when using the number array function', () => {
        // Setup
        const stringToTest = '!generate encounter -p 1 2 3'
        const flagName = '-p'

        const expectedResult = [1, 2, 3]

        // Test
        const actualResult = extractFlagNumberList(stringToTest, flagName)

        // Assert
        expect(actualResult).toStrictEqual(expectedResult)
    })
})
