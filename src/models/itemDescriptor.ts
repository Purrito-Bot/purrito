export interface ValuedDescriptor extends WeightedDescriptor {
    minValue: number
    maxValue: number
}

export interface WeightedDescriptor {
    weight: number
    label: string
}


