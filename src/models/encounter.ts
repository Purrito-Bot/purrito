import { IMonster } from './monster'

export class Encounter {
    monsters: { monster: IMonster; amount: number }[]
    totalXP: number

    constructor() {
        this.monsters = []
        this.totalXP = 0
    }

    getAdjustedXP(players?: number): number {
        let totalMonsters = 0

        this.monsters.forEach(
            monster => (totalMonsters = totalMonsters + monster.amount)
        )

        let adjustment = 1

        if (!players || (players >= 3 && players <= 5)) {
            if (totalMonsters === 1) adjustment = 1
            else if (totalMonsters === 2) adjustment = 1.5
            else if (totalMonsters >= 3 && totalMonsters <= 6) adjustment = 2
            else if (totalMonsters >= 7 && totalMonsters <= 10) adjustment = 2.5
            else if (totalMonsters >= 11 && totalMonsters <= 14) adjustment = 3
            else if (totalMonsters >= 15) adjustment = 4
        } else if (players < 3) {
            if (totalMonsters === 1) adjustment = 1.5
            else if (totalMonsters === 2) adjustment = 2
            else if (totalMonsters >= 3 && totalMonsters <= 6) adjustment = 2.5
            else if (totalMonsters >= 7 && totalMonsters <= 10) adjustment = 3
            else if (totalMonsters >= 11 && totalMonsters <= 14) adjustment = 4
            else if (totalMonsters >= 15) adjustment = 5
        } else if (players > 5) {
            if (totalMonsters === 1) adjustment = 0.5
            else if (totalMonsters === 2) adjustment = 1
            else if (totalMonsters >= 3 && totalMonsters <= 6) adjustment = 1.5
            else if (totalMonsters >= 7 && totalMonsters <= 10) adjustment = 2
            else if (totalMonsters >= 11 && totalMonsters <= 14)
                adjustment = 2.5
            else if (totalMonsters >= 15) adjustment = 3
        }

        return this.totalXP * adjustment
    }

    formatEncounterForMessage(players?: number): string {
        let encounterString = 'Encounter:'

        this.monsters.forEach(
            monster =>
                (encounterString = `${encounterString}\n${monster.amount} ${monster.monster.name}`)
        )

        encounterString = `${encounterString}\nEncounter XP: ${
            this.totalXP
        }\nAdjusted XP: ${this.getAdjustedXP(players)}`

        return encounterString
    }
}

export type EncounterDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'DEADLY'
