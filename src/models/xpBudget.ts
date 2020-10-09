/**
 * Represents the daily XP Budgets of a PC, and what is considered an easy
 * medium and deadly encounter.
 */
export type XPBudget = {
    level: number
    easy: number
    medium: number
    hard: number
    deadly: number
    dailyBudget: number
}

// this could probably live in mongo but happy for it to be here for now
export const XPBudgets: XPBudget[] = [
    { level: 1, easy: 25, medium: 50, hard: 75, deadly: 100, dailyBudget: 300 },
    {
        level: 2,
        easy: 50,
        medium: 100,
        hard: 150,
        deadly: 200,
        dailyBudget: 600,
    },
    {
        level: 3,
        easy: 75,
        medium: 150,
        hard: 225,
        deadly: 400,
        dailyBudget: 1200,
    },
    {
        level: 4,
        easy: 125,
        medium: 250,
        hard: 375,
        deadly: 500,
        dailyBudget: 1700,
    },
    {
        level: 5,
        easy: 250,
        medium: 500,
        hard: 750,
        deadly: 1100,
        dailyBudget: 3500,
    },
    {
        level: 6,
        easy: 300,
        medium: 600,
        hard: 900,
        deadly: 1400,
        dailyBudget: 4000,
    },
    {
        level: 7,
        easy: 350,
        medium: 750,
        hard: 1100,
        deadly: 1700,
        dailyBudget: 5000,
    },
    {
        level: 8,
        easy: 450,
        medium: 900,
        hard: 1400,
        deadly: 2100,
        dailyBudget: 6000,
    },
    {
        level: 9,
        easy: 550,
        medium: 1100,
        hard: 1600,
        deadly: 2400,
        dailyBudget: 7500,
    },
    {
        level: 10,
        easy: 600,
        medium: 1200,
        hard: 1900,
        deadly: 2800,
        dailyBudget: 9000,
    },
    {
        level: 11,
        easy: 800,
        medium: 1600,
        hard: 2400,
        deadly: 3600,
        dailyBudget: 10500,
    },
    {
        level: 12,
        easy: 1000,
        medium: 2000,
        hard: 3000,
        deadly: 4500,
        dailyBudget: 11500,
    },
    {
        level: 13,
        easy: 1100,
        medium: 2200,
        hard: 3400,
        deadly: 5100,
        dailyBudget: 13500,
    },
    {
        level: 14,
        easy: 1250,
        medium: 2500,
        hard: 3800,
        deadly: 5700,
        dailyBudget: 15000,
    },
    {
        level: 15,
        easy: 1400,
        medium: 2800,
        hard: 4300,
        deadly: 6400,
        dailyBudget: 18000,
    },
    {
        level: 16,
        easy: 1600,
        medium: 3200,
        hard: 4800,
        deadly: 7200,
        dailyBudget: 20000,
    },
    {
        level: 17,
        easy: 2000,
        medium: 3900,
        hard: 5900,
        deadly: 8800,
        dailyBudget: 25000,
    },
    {
        level: 18,
        easy: 2100,
        medium: 4200,
        hard: 6300,
        deadly: 9500,
        dailyBudget: 27000,
    },
    {
        level: 19,
        easy: 2400,
        medium: 4900,
        hard: 7300,
        deadly: 10900,
        dailyBudget: 30000,
    },
    {
        level: 20,
        easy: 2800,
        medium: 5700,
        hard: 8500,
        deadly: 12700,
        dailyBudget: 40000,
    },
]
