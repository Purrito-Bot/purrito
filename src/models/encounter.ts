import { Monster } from './monster'

export type Encounter = {
    monsters: { monster: Monster; amount: number }[]
    totalXP: number
}

export type EncounterDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'DEADLY'
