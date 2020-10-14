import { Encounter, EncounterDifficulty } from '../../models/encounter'
import { Environment, IMonster } from '../../models/monster'
import monsters from '../../monsters.json'
import { getRandomValueFromArray } from '../../utils'
import { calculateXpBudgetForDifficulty } from './xpUtils'

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
    let potentialMonsters: IMonster[] = []

    if (environment) {
                         // Filter monsters based on the given environment
                         //  Monsters don't have environment at the mo
                     } else {
        potentialMonsters = [...monsters]
    }

    // Calculate the XP Budget
    const xpBudget = calculateXpBudgetForDifficulty(
        partyMemberLevels,
        difficulty || 'MEDIUM'
    )

    let encounter = new Encounter()

    while (encounter.getAdjustedXP(partyMemberLevels.length) < xpBudget) {
        // We don't want a monster where the XP is higher than this value
        const xpDifference =
            xpBudget - encounter.getAdjustedXP(partyMemberLevels.length)

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
