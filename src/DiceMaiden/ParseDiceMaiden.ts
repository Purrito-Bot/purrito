import { DiceMaidenResult } from "./DiceMaidenResult";

/**
 * @description Parse the message from Dice Maiden into a DiceMaidenResult object.
 * @param message - The Discord message
 */
export function parseDiceMaidenMessage(messageContent: string): DiceMaidenResult {

    // example message:
    // player_name Roll: `[5], [1]` Result: 6.

    const result = new DiceMaidenResult();

    const rollerName = messageContent.match(/\S+/)
    if (rollerName !== null) {
        result.rollerName = rollerName[0];
    }

    const totalResultStr = messageContent.match(/(?<=Result:\s)\d+/)
    if (totalResultStr && totalResultStr.length === 1) {
        const totalResult = Number.parseInt(totalResultStr[0], 10)
        if (!isNaN(totalResult)) {
            result.success = true
            result.totalResult = totalResult
        }
    }

    const rollStrs = messageContent.match(/\[\d+\]/g)
    if (rollStrs && rollStrs.length >= 1) {
        rollStrs.forEach(rollStr => {
            const rollNumStr = rollStr.replace('[', '').replace(']', '');
            const rollResult = Number.parseInt(rollNumStr, 10)
            if (!isNaN(rollResult)) {
                result.diceRolls.push(rollResult)
            }
        })
    }

    return result
}