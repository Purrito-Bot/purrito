import { Message } from 'discord.js'
import { EncounterDifficulty } from '../models/encounter'
import { askForReaction, askForTextResponse } from '../utils'
import { _generateEncounter } from './encounter/encounterUtils'

/**
 * Given +generate encounter, generate an item based on the sets of data
 * @param message the discord message
 * @param args arguments provided for the command
 */
export async function generateEncounter(message: Message, args?: string[]) {
    let party: string | undefined
    let difficulty: EncounterDifficulty | undefined

    party = await askForTextResponse(message, 'describe your party e.g. 1 2 3')

    if (!party) return

    const partyLevels: number[] = []

    party
        .trim()
        .split(' ')
        .forEach(level => partyLevels.push(parseInt(level)))

    if (partyLevels.some(partyLevel => isNaN(partyLevel))) {
        message.reply('party levels must be numerical e.g. 4')
        return
    }

    const difficultyResponse = await askForReaction(
        message,
        'react with your difficulty!\n1 easy\n2 medium\n3 hard\n4 deadly',
        ['1️⃣', '2️⃣', '3️⃣', '4️⃣']
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

    message.reply(
        _generateEncounter(
            partyLevels,
            undefined,
            difficulty
        ).formatEncounterForMessage(partyLevels.length)
    )
}
