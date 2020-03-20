import { DiceMaidenResult } from "./DiceMaidenResult";

/**
 * @description Parse the message from Dice Maiden into a DiceMaidenResult object.
 * @param message - The Discord message
 */
export function parseDiceMaidenMessage(messageContent: string): DiceMaidenResult {

    // example message:
    // player_name Roll: `[5], [1]` Result: 6

    const result = new DiceMaidenResult()

    const rollerName = extractRollerName(messageContent)
    const totalResult = extractTotalResult(messageContent)
    const diceRolls = extractDiceRolls(messageContent)

    if (rollerName && totalResult && diceRolls) {
        result.parseSuccessful = true
        result.rollerName = rollerName
        result.totalResult = totalResult
        result.diceRolls = diceRolls
    }
    return result
}


function extractDiceRolls(messageContent: string): number[] | null {
    let result: number[] | null = null

    const rollStrs = messageContent.match(/(?<=Roll:\s)\[.+\]/g)
    if (rollStrs && rollStrs.length >= 1) {

        const rolls = rollStrs
            // check for multiple rolls in the set by splitting on the comma
            .flatMap(rollStr => rollStr.split(','))
            .map(rollStr => rollStr.replace('[', '').replace(']', '').replace(',', '').trim())
            .filter(rollStr => rollStr !== null && rollStr !== '')
            .map(rollNumStr => parseInt(rollNumStr, 10))

        if (rolls.filter(roll => isNaN(roll)).length === 0) {

            result = rolls
        }
    }
    return result
}

function extractTotalResult(messageContent: string): number | null {
    let result: number | null = null;
    const totalResultStr = messageContent.match(/(?<=Result:\s)\d+/)
    if (totalResultStr && totalResultStr.length === 1) {
        const totalResult = parseInt(totalResultStr[0], 10)
        if (!isNaN(totalResult)) {
            result = totalResult
        }
    }
    return result
}

function extractRollerName(messageContent: string): string | null {
    let result: string | null = null;
    const rollerName = messageContent.match(/\S+/)
    if (rollerName && rollerName.length === 1) {
        result = rollerName[0]
    }
    return result
}