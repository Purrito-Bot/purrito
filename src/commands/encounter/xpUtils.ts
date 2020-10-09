import { EncounterDifficulty } from '../../models/encounter'
import { XPBudget, XPBudgets } from '../../models/xpBudget'

/**
 * Given a list of character levels, calculate the XP Budget
 * @param levels the levels of each character in the party involved
 */
export function calculateXpBudget(levels: number[]): XPBudget {
    const budgets: XPBudget[] = []
    let budget: XPBudget = {
        level: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        deadly: 0,
        dailyBudget: 0,
    }

    levels.forEach(level =>
        budgets.push(XPBudgets.find(XPBudget => XPBudget.level === level)!)
    )

    budgets.forEach(xpBudget => {
        budget = addXPBudgets(budget, xpBudget)
    })

    return budget
}

/**
 * Given a list of character levels, calculate the XP Budget
 * @param levels the levels of each character in the party involved
 */
export function calculateXpBudgetForDifficulty(
    levels: number[],
    encounterDifficulty: EncounterDifficulty
): number {
    const budgets: XPBudget[] = []
    let budget: XPBudget = {
        level: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        deadly: 0,
        dailyBudget: 0,
    }

    levels.forEach(level =>
        budgets.push(XPBudgets.find(XPBudget => XPBudget.level === level)!)
    )

    budgets.forEach(xpBudget => {
        budget = addXPBudgets(budget, xpBudget)
    })

    let xpBudget: number

    switch (encounterDifficulty) {
        case 'EASY':
            xpBudget = budget.easy
            break
        case 'HARD':
            xpBudget = budget.hard
            break
        case 'DEADLY':
            xpBudget = budget.deadly
            break
        case 'MEDIUM':
        default:
            xpBudget = budget.medium
            break
    }

    return xpBudget
}

/**
 * Add together two XP Budgets to create a new total.
 * @param xpBudgetA first xp budget
 * @param xpBudgetB second xp budget
 */
export function addXPBudgets(
    xpBudgetA: XPBudget,
    xpBudgetB: XPBudget
): XPBudget {
    return {
        level: xpBudgetA.level + xpBudgetB.level,
        easy: xpBudgetA.easy + xpBudgetB.easy,
        medium: xpBudgetA.medium + xpBudgetB.medium,
        hard: xpBudgetA.hard + xpBudgetB.hard,
        deadly: xpBudgetA.deadly + xpBudgetB.deadly,
        dailyBudget: xpBudgetA.dailyBudget + xpBudgetB.dailyBudget,
    }
}
