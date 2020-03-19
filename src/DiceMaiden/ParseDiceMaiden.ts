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
    console.log(totalResultStr)
    if (totalResultStr && totalResultStr.length === 1) {
        console.log(totalResultStr[0])
        const totalResult = Number.parseInt(totalResultStr[0], 10)
        if (!isNaN(totalResult)) {
            result.success = true
            result.totalResult = totalResult
        }
    }

    const rollStrs = messageContent.match(/\[\d+\]/g)
    console.log('rolls' + rollStrs + ' ')
    if (rollStrs && rollStrs.length >= 1) {
        console.log('rolls len' + rollStrs.length)
        console.log(rollStrs[0])
        rollStrs.forEach(rollStr => {
            const rollNumStr = rollStr.replace('[', '').replace(']', '');
            const rollResult = Number.parseInt(rollNumStr, 10)
            if (!isNaN(rollResult)) {
                result.diceRolls.push(rollResult)
            }
        })
    }

    console.log(`Dice Maiden parse result: ${JSON.stringify(result)}`)

    return result
}