import { getRandomValueFromArray, createdWeightedList } from '../utils'
import { ValuedDescriptor } from './valuedDescriptor'
import { Materials } from '../const/materials'
import { Colours } from '../const/colours'
import { Descriptors } from '../const/descriptors'
import { Conditions } from '../const/conditions'
import { Sizes } from '../const/sizes'
import { Renowns } from '../const/renowns'
import { Ages } from '../const/ages'
import { ItemTypes } from '../const/itemTypes'

export interface IItem {
    type: string
    material: string
    colour: string
    descriptors: string[]
    condition: ValuedDescriptor
    size: ValuedDescriptor
    renown: ValuedDescriptor
    age: ValuedDescriptor
}

export class Item {
    type: string
    material: string
    colour: string
    descriptors: string[]
    condition: ValuedDescriptor
    size: ValuedDescriptor
    renown: ValuedDescriptor
    age: ValuedDescriptor

    constructor()
    constructor(item: IItem)
    constructor(item?: IItem) {
        this.type = item?.type ? item.type : getRandomValueFromArray(ItemTypes)
        this.material = item?.material
            ? item.material
            : getRandomValueFromArray(Materials)
        this.colour = item?.colour
            ? item.colour
            : getRandomValueFromArray(Colours)
        this.descriptors = item?.descriptors
            ? item.descriptors
            : [
                  getRandomValueFromArray(Descriptors),
                  getRandomValueFromArray(Descriptors),
                  getRandomValueFromArray(Descriptors),
              ]
        this.condition = item?.condition
            ? item.condition
            : getRandomValueFromArray(createdWeightedList(Conditions))
        this.size = item?.size
            ? item.size
            : getRandomValueFromArray(createdWeightedList(Sizes))
        this.renown = item?.renown
            ? item.renown
            : getRandomValueFromArray(createdWeightedList(Renowns))
        this.age = item?.age
            ? item.age
            : getRandomValueFromArray(createdWeightedList(Ages))
    }

    formatItemForMessage(): string {
        let message: string

        message = `Treasure Type: ${this.type} \nMaterial: ${
            this.material
        } \nColour: ${this.colour} \nDescriptors:${this.descriptors.map(
            descriptor => {
                return ` ${descriptor}`
            }
        )} \nCondition: ${this.condition.label} \nSize: ${
            this.size.label
        } \nRenown: ${this.renown.label} \nAge: ${
            this.age.label
        }\n Value: ${this.generateValue()}`

        return message
    }

    formateLiteMessage(): string {
        return `Treasure Type: ${this.type}\nValue: ${this.generateValue()}`
    }

    generateValue(): number {
        return (
            this.condition.value +
            this.age.value +
            this.renown.value +
            this.size.value
        )
    }
}