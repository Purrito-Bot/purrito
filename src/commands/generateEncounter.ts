import { Message } from 'discord.js'
import { EncounterDifficulty } from '../models/encounter'
import { Environment } from '../models/monster'
import { _generateEncounter } from './encounter/encounterUtils'

/**
 * Given +generate encounter, generate an item based on the sets of data
 * @param message the discord message
 * @param args arguments provided for the command
 */
export async function generateEncounter(message: Message, args?: string[]) {
    let messageToReturn: string
    // arg[1] - environment
    // arg[2] - difficulty
    // arg[3] - party size
    // arg[4] - party average level
    if (Array.isArray(args) && args.length > 0) {
        if (!args[1] || !args[2] || !args[3] || !args[4]) {
            messageToReturn =
                'please provide details of your encounter with environment, difficulty, party size and average level' +
                '\ne.g. +generate encounter mountain easy 2 1'
        } else {
            const environment = args[1].toUpperCase() as Environment
            const difficulty = args[2].toUpperCase() as EncounterDifficulty
            const partySize = parseInt(args[3])
            const averageLevel = parseInt(args[4])

            if (isNaN(averageLevel)) {
                messageToReturn = `average level must be a number e.g. 1 or 2 not ${args[3]}`
            } else if (isNaN(partySize)) {
                messageToReturn = `party size must be a number e.g. 1 or 2 not ${args[4]}`
            } else {
                // Is average level and party size the best way here? I don't think so
                // but it is the easiest
                const estimatedParty: number[] = []
                for (let index = 0; index < partySize; index++) {
                    estimatedParty.push(averageLevel)
                }

                //TODO how do we sensible put the party levels into a discord message?
                // Do we need to?
                const encounter = _generateEncounter(
                    environment,
                    difficulty,
                    estimatedParty
                )

                messageToReturn = encounter.formatEncounterForMessage()
            }
        }
    } else {
        messageToReturn =
            'please provide details of your encounter e.g. +generate encounter mountain easy'
    }

    await message.channel.send(messageToReturn)
}
