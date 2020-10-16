import { ValuedDescriptor } from '../models/itemDescriptor'

export const Conditions: ValuedDescriptor[] = [
    { weight: 1, label: 'Awful', value: 0 },
    { weight: 1, label: 'Very Poor', value: 1 },
    { weight: 2, label: 'Poor', value: 2 },
    { weight: 2, label: 'Below Avg.', value: 3 },
    { weight: 7, label: 'Average', value: 4 },
    { weight: 4, label: 'Above Avg.', value: 5 },
    { weight: 1, label: 'Good', value: 6 },
    { weight: 1, label: 'Very Good', value: 7 },
    { weight: 1, label: 'Excellent', value: 8 },
    { weight: 1, label: 'Flawless', value: 9 },
]
