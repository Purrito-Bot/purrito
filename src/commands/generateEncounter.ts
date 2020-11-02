import { Message } from 'discord.js'
import { EncounterDifficulty } from '../models/encounter'
import { askForReaction, askForTextResponse } from '../utils/chatUtils'
import { _generateEncounter } from '../utils/encounterUtils'

/**
 * Given +generate encounter, generate an item based on the sets of data
 * @param message the discord message
 * @param args arguments provided for the command
 */
export async function generateEncounter(message: Message, args?: string[]) {
    let party: string | undefined
    let difficulty: EncounterDifficulty | undefined

    party = await askForTextResponse(
        message,
        'Step 1: describe your party **Hint**: for a party of 3, with a level 1 2 and 3 type "1 2 3"',
        true
    )

    if (!party) return

    const partyLevels: number[] = []

    party
        .trim()
        .split(' ')
        .forEach((level) => partyLevels.push(parseInt(level)))

    if (partyLevels.some((partyLevel) => isNaN(partyLevel))) {
        message.reply('party levels must be numerical e.g. 4')
        return
    }

    if (partyLevels.some((partyLevel) => partyLevel > 20)) {
        message.reply("you can't have a party member over level 20")
        return
    }

    if (partyLevels.some((partyLevel) => partyLevel < 1)) {
        message.reply("you can't have a party member under level 1")
        return
    }

    const difficultyResponse = await askForReaction(
        message,
        'Step 2: react with your desired difficulty\n1 - easy\n2 - medium\n3 - hard\n4 - deadly',
        ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
        true
    )

    switch (difficultyResponse?.emoji.name) {
        case '1️⃣':
            difficulty = 'EASY'
            break
        case '2️⃣':
            difficulty = 'MEDIUM'
            break
        case '3️⃣':
            difficulty = 'HARD'
            break
        case '4️⃣':
            difficulty = 'DEADLY'
            break
    }

    if (!difficulty) return

    const embed = _generateEncounter(
        partyLevels,
        undefined,
        difficulty
    ).createEmbed(partyLevels, difficulty)

    return message.channel.send(embed)
}
