import { ValuedDescriptor } from '../models/valuedDescriptor'

export const Renowns: ValuedDescriptor[] = [
    { weight: 3, label: 'Unknown', value: -3 },
    { weight: 3, label: 'Obscurely-known', value: -2 },
    { weight: 1, label: 'Obscurely-known', value: -1 },
    { weight: 6, label: 'Regionally-known', value: 0 },
    { weight: 4, label: 'Nationally-known', value: 1 },
    { weight: 1, label: 'Continentally-known', value: 2 },
    { weight: 1, label: 'World-known', value: 3 },
    { weight: 1, label: 'Fabled', value: 4 },
    { weight: 1, label: 'Legendary', value: 5 },
]
