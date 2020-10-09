import { Monster } from './monster'

export class Encounter {
    monsters: { monster: Monster; amount: number }[]
    totalXP: number

    constructor() {
        this.monsters = []
        this.totalXP = 0
    }

    formatEncounterForMessage(): string {
        let encounterString = 'Encounter:'

        this.monsters.forEach(
            monster =>
                (encounterString = `${encounterString}\n${monster.amount} ${monster.monster.name}`)
        )

        encounterString = `${encounterString}\nEncounter XP: ${this.totalXP}`

        return encounterString
    }
}

export type EncounterDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'DEADLY'
