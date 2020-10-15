import { getRandomValueFromArray, createdWeightedList } from '../utils/utils'
import { ValuedDescriptor } from './valuedDescriptor'
import { Materials } from '../const/materials'
import { Colours } from '../const/colours'
import { Descriptors } from '../const/descriptors'
import { Conditions } from '../const/conditions'
import { Sizes } from '../const/sizes'
import { Renowns } from '../const/renowns'
import { Ages } from '../const/ages'
import { ItemTypes } from '../const/itemTypes'
import { PrintableObject } from './printableObject'
import { Message, MessageEmbed } from 'discord.js'

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

export class Item implements PrintableObject {
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

    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
        embed.setTitle('Random Item')
        embed.addField('Type', this.type)
        embed.addField('Material', this.material)
        embed.addField('Colour', this.colour)
        embed.addField('Descriptors', this.descriptors)
        embed.addField('Condition', this.condition.label)
        embed.addField('Size', this.size.label)
        embed.addField('Renown', this.renown.label)
        embed.addField('Age', this.age.label)
        embed.addField('Value', this.generateValue())
        return embed
    }

    createLiteEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
        embed.setTitle('Random Item')
        embed.addField('Value', this.generateValue())
        return embed
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
