export type Monster = {
    name: string
    xp: number
    environments: Environment[]
}

export type Environment = 'MOUNTAIN' | 'TREE'

export const Monsters: Monster[] = [
    { name: 'Goblin', environments: ['MOUNTAIN'], xp: 25 },
]
