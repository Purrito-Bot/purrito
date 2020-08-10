import { ValuedDescriptor } from '../models/valuedDescriptor'

export const Conditions: ValuedDescriptor[] = [
    { weight: 1, label: 'Awful', value: -4 },
    { weight: 1, label: 'Very Poor', value: -3 },
    { weight: 2, label: 'Poor', value: -2 },
    { weight: 2, label: 'Below Avg.', value: -1 },
    { weight: 7, label: 'Average', value: 0 },
    { weight: 4, label: 'Above Avg.', value: 1 },
    { weight: 1, label: 'Good', value: 2 },
    { weight: 1, label: 'Very Good', value: 3 },
    { weight: 1, label: 'Excellent', value: 4 },
    { weight: 1, label: 'Flawless', value: 5 },
]
