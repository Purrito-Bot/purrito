export type Monster = {
    name: string
    xp: number
    environments: Environment[]
}

export type Environment = 'MOUNTAIN' | 'TREE'

export const Monsters: Monster[] = [
    { name: 'Goblin', environments: ['MOUNTAIN'], xp: 50 },
    { name: 'Frost Giant', environments: ['MOUNTAIN'], xp: 3900 },
]
