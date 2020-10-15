import { MessageEmbed } from 'discord.js'
import { Ages } from '../const/ages'
import { Colours } from '../const/colours'
import { Conditions } from '../const/conditions'
import { Descriptors } from '../const/descriptors'
import { ItemTypes } from '../const/itemTypes'
import { Renowns } from '../const/renowns'
import { Sizes } from '../const/sizes'
import { createdWeightedList, getRandomValueFromArray } from '../utils/utils'
import { PrintableObject } from './printableObject'
import { ValuedDescriptor } from './valuedDescriptor'

export interface IItem {
    type: string
    colour: string
    descriptors: string[]
    condition: ValuedDescriptor
    size: ValuedDescriptor
    renown: ValuedDescriptor
    age: ValuedDescriptor
}

export class Item implements PrintableObject {
    type: string
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

        if (this.type.includes('Magic Item')) {
            embed.setFooter(
                'You have a magic item, roll on the appropriate table to find out what you got.'
            )
        } else {
            embed.setDescription(
                'Use the value as a guideline on what GP value to assign it for your party. This number will range between -7 (trash) to 28 (god like item)'
            )
            embed.addField('Colour', this.colour)
            embed.addField('Descriptors', this.descriptors)
            embed.addField('Condition', this.condition.label)
            embed.addField('Size', this.size.label)
            embed.addField('Renown', this.renown.label)
            embed.addField('Age', this.age.label)
            embed.addField('Value', this.generateValue())
        }
        return embed
    }

    createLiteEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
        embed.setTitle('Random Item')
        if (this.type.includes('Magic Item')) {
            embed.setDescription(this.type)
            embed.setFooter(
                'You have a magic item, roll on the appropriate table to find out what you got.'
            )
        } else {
        embed.addField('Value', this.generateValue())
        }
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
