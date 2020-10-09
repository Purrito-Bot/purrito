import { Message } from 'discord.js'
import { Encounter, EncounterDifficulty } from '../models/encounter'
import { Environment } from '../models/monster'
import { getRandomValueFromArray } from '../utils'
import { filterMonstersByEnvironment } from './encounter/monsterUtils'
import { calculateXpBudgetForDifficulty } from './encounter/xpUtils'

/**
 * Given +generate encounter, generate an item based on the sets of data
 * @param message
 * @param args
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
            const encounterEnvironment = args[1].toUpperCase() as Environment
            const difficulty = args[2].toUpperCase() as EncounterDifficulty

            // Filter monsters based on the given environment
            const potentialMonsters = filterMonstersByEnvironment(
                encounterEnvironment
            )

            // Calculate the XP Budget
            //TODO how can we sensibly pass in party details?
            const xpBudget = calculateXpBudgetForDifficulty(
                [7, 7, 2],
                difficulty
            )

            let encounter = new Encounter()

            while (encounter.totalXP < xpBudget) {
                const monster = getRandomValueFromArray(potentialMonsters)

                let encounterMonster = encounter.monsters.find(
                    encounterMonster => encounterMonster.monster === monster
                )

                if (encounterMonster) {
                    encounterMonster.amount = encounterMonster.amount + 1
                } else {
                    encounter.monsters.push({ monster, amount: 1 })
                }

                encounter.totalXP = encounter.totalXP + monster.xp
            }

            messageToReturn = encounter.formatEncounterForMessage()
        }
    } else {
        messageToReturn =
            'please provide details of your encounter e.g. +generate encounter mountain easy'
    }

    await message.channel.send(messageToReturn)
}
