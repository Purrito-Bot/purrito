import { Message } from 'discord.js'
import { logger } from '../logger'
import { Encounter, EncounterDifficulty } from '../models/encounter'
import { Environment } from '../models/monster'
import { getRandomValueFromArray } from '../utils'
import { filterMonstersByEnvironment } from './encounter/monsterUtils'
import { calculateXpBudget } from './encounter/xpUtils'

/**
 * Given +generate encounter, generate an item based on the sets of data
 * @param message
 * @param args
 */
export async function generateEncounter(message: Message, args?: string[]) {
    let messageToReturn: string

    let encounterEnvironment: Environment | undefined
    let difficulty: EncounterDifficulty | undefined
    // arg[1] - environment
    // arg[2] - difficulty
    if (Array.isArray(args) && args.length > 0) {
        if (!args[1] || !args[2]) {
            messageToReturn =
                'please provide details of your encounter e.g. +generate encounter mountain easy'
        } else {
            encounterEnvironment = args[1].toUpperCase() as Environment
            difficulty = args[2].toUpperCase() as EncounterDifficulty

            const xpBudgetForParty = calculateXpBudget([7, 7, 2])
            let xpBudget: number

            switch (difficulty) {
                case 'EASY':
                    xpBudget = xpBudgetForParty.easy
                    break
                case 'HARD':
                    xpBudget = xpBudgetForParty.hard
                    break
                case 'DEADLY':
                    xpBudget = xpBudgetForParty.deadly
                    break
                case 'MEDIUM':
                default:
                    xpBudget = xpBudgetForParty.medium
                    break
            }

            const potentialMonsters = filterMonstersByEnvironment(
                encounterEnvironment
            )

            let encounter: Encounter = {
                monsters: [],
                totalXP: 0,
            }

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

            messageToReturn = JSON.stringify(encounter)
        }
    } else {
        messageToReturn =
            'please provide details of your encounter e.g. +generate encounter mountain easy'
    }

    await message.channel.send(messageToReturn)
}
