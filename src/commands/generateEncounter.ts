import { Message } from 'discord.js'
import { EncounterDifficulty } from '../models/encounter'
import { Environment } from '../models/monster'
import { _generateEncounter } from './encounter/encounterUtils'
import { extractFlagNumberList, extractFlagWord } from './flagUtils'

/**
 * Given +generate encounter, generate an item based on the sets of data
 * @param message the discord message
 * @param args arguments provided for the command
 */
export async function generateEncounter(message: Message, args?: string[]) {
    let messageToReturn: string

    // arg[1] help

    if (
        Array.isArray(args) &&
        args.length > 0 &&
        args[1] &&
        args[1].toLowerCase() === 'help'
    ) {
        return await message.channel.send(
            'generate an encounter with the following flags\nparty -p = party levels e.g. 1 2 3 (required)\nenv -e = choose an environment e.g. mountain\ndifficulty -d = choose a difficulty e.g. easy'
        )
    }

    const environment = (
        extractFlagWord(message.content, 'env') ||
        extractFlagWord(message.content, '-e')
    )?.toUpperCase() as Environment

    const difficulty = (
        extractFlagWord(message.content, 'difficulty') ||
        extractFlagWord(message.content, '-d')
    )?.toUpperCase() as EncounterDifficulty

    const party =
        extractFlagNumberList(message.content, 'party') ||
        extractFlagNumberList(message.content, '-p')

    if (!party || party.length === 0) {
        await message.channel.send(
            'please provide an party levels using the party or -p flag'
        )
        return
    }

    const encounter = _generateEncounter(party, environment, difficulty)

    messageToReturn = encounter.formatEncounterForMessage()

    await message.channel.send(messageToReturn)
}
