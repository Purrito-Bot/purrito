import { Encounter, EncounterDifficulty } from '../../models/encounter'
import { Environment, Monsters, Monster } from '../../models/monster'
import { getRandomValueFromArray } from '../../utils'
import { filterMonstersByEnvironment } from './monsterUtils'
import { calculateXpBudgetForDifficulty } from './xpUtils'
import { logger } from '../../logger'

/**
 * Generate a random encounter based on the parameters given in the discord message.
 * @param environment the environment, used to filter the monsters which can be used
 * @param difficulty the difficulty will determine the XP total of the encounter
 * @param partyMemberLevels the levels of the party members, needed for determining
 * XP total of an encounter
 */
export function _generateEncounter(
    partyMemberLevels: number[],
    environment?: Environment,
    difficulty?: EncounterDifficulty
) {
    let potentialMonsters: Monster[] = []

    if (environment) {
        // Filter monsters based on the given environment
        potentialMonsters = Monsters.filter(monster =>
            monster.environments.includes(environment)
        )
    } else {
        potentialMonsters = [...Monsters]
    }

    // Calculate the XP Budget
    const xpBudget = calculateXpBudgetForDifficulty(
        partyMemberLevels,
        difficulty || 'MEDIUM'
    )

    let encounter = new Encounter()

    while (encounter.totalXP < xpBudget) {
        // We don't want a monster where the XP is higher than this value
        const xpDifference = xpBudget - encounter.totalXP

        const monstersWithCorrectXP = potentialMonsters.filter(
            monster => monster.xp <= xpDifference
        )

        // If there are no monsters left to use, get out of this while
        if (monstersWithCorrectXP.length === 0) break

        const monster = getRandomValueFromArray(monstersWithCorrectXP)

        // See if this monster is already being used in the encounter
        let monsterInEncounter = encounter.monsters.find(
            encounterMonster => encounterMonster.monster === monster
        )

        // If the monster is already used, just increment the 'amount'
        // rather than adding a new monster to the encounter object
        if (monsterInEncounter) {
            monsterInEncounter.amount = monsterInEncounter.amount + 1
        } else {
            encounter.monsters.push({ monster, amount: 1 })
        }

        encounter.totalXP = encounter.totalXP + monster.xp
    }

    return encounter
}
