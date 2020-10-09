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
    if (Array.isArray(args) && args.length > 0) {
        if (!args[1] || !args[2]) {
            messageToReturn =
                'please provide details of your encounter e.g. +generate encounter mountain easy'
        } else {
                   const environment = args[1].toUpperCase() as Environment
                   const difficulty = args[2].toUpperCase() as EncounterDifficulty
                   //TODO how do we sensible put the party levels into a discord message? Do we need to?
                   const encounter = _generateEncounter(
                       environment,
                       difficulty,
                       [7, 7, 2]
                   )

                   messageToReturn = encounter.formatEncounterForMessage()
               }
    } else {
        messageToReturn =
            'please provide details of your encounter e.g. +generate encounter mountain easy'
    }

    await message.channel.send(messageToReturn)
}

