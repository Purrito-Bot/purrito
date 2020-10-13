/**
 * Given a string such as '!generate encounter foo bar' with a key of 'foo'
 * pull out the text 'bar'. This specifically targets WORDS
 * @param haystack the string to extract from
 * @param flagName the name of the flag e.g. 'env'
 */
export function extractFlagWord(
    haystack: string,
    flagName: string
): string | undefined {
    // The needle in our haystack
    let needle: string | undefined

    // Convert the flag name into a regular expression
    const regex = new RegExp(`(?:\\s${flagName}\\s+)(\\w*)`)
    // Try and match this regexp using the haystack string
    const regexArray = haystack.match(regex)

    // if there's a match, assume we want the first match
    if (regexArray) {
        needle = regexArray[1]
    }

    return needle
}

/**
 * Given a string such as '!generate encounter foo 1 2 3' with a key of 'foo'
 * pull out the text '1 2 3'. This specifically targets LIST OF NUMBERS
 * @param haystack the string to extract from
 * @param flagName the name of the flag e.g. 'env'
 */
export function extractFlagNumberList(
    haystack: string,
    flagName: string
): number[] | undefined {
    // The needle in our haystack
    let needle: number[] = []

    // Convert the flag name into a regular expression
    const regex = new RegExp(`(?:\\s${flagName}\\s+)((\\d\\s*)*)`)

    // Try and match this regexp using the haystack string
    const regexArray = haystack.match(regex)

    // if there's a match, assume we want the first match
    if (regexArray) {
        // split the match into multiple strings
        const asStrings = regexArray[1].trim().split(' ')

        // go through each string, and try parse into an number
        asStrings.forEach(asString => {
            const asNumber = parseInt(asString)
            // if it's a legit number put it in the needle
            if (!isNaN(asNumber)) needle.push(asNumber)
        })
    } else {
        return undefined
    }

    return needle
}
