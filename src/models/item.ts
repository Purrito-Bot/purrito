import { MessageEmbed } from 'discord.js'
import { randomIntegerBetweenNumbers } from '../utils/utils'
import { ValuedDescriptor } from './itemDescriptor'
import { ItemType } from './itemType'
import { PrintableObject } from './printableObject'

export interface IItem {
    type: ItemType
    material?: string
    colour: { hex: string; name: string; rgb: string }
    descriptors: string[]
    condition: ValuedDescriptor
    size: ValuedDescriptor
    intrigue: ValuedDescriptor
    age: ValuedDescriptor
    magicalProperty?: string
}

export class Item implements PrintableObject {
    type: string
    material?: string
    colour: { hex: string; name: string; rgb: string }
    descriptors: string[]
    condition: string
    size: string
    intrigue: string
    age: string
    magicalProperty?: string
    value: number

    constructor(item: IItem) {
        this.type = item.type.label
        this.material = item.material
        this.colour = item.colour
        this.descriptors = item.descriptors
        this.condition = item.condition.label
        this.size = item.size.label
        this.intrigue = item.intrigue.label
        this.age = item.age.label
        this.magicalProperty = item.magicalProperty
        this.value =
            randomIntegerBetweenNumbers(
                item.condition.minValue,
                item.condition.maxValue
            ) +
            randomIntegerBetweenNumbers(item.age.minValue, item.age.maxValue) +
            randomIntegerBetweenNumbers(
                item.intrigue.minValue,
                item.intrigue.maxValue
            ) +
            randomIntegerBetweenNumbers(item.size.minValue, item.size.maxValue)
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
                'Use the value as a guideline on what GP value to assign it for your party. This number will range between 0 (trash) to 100 (god like item)'
            )
            if (this.material) embed.addField('Material', this.material)
            embed.addField('Colour', this.colour.name)
            embed.addField('Descriptors', this.descriptors)
            embed.addField('Condition', this.condition)
            embed.addField('Size', this.size)
            embed.addField('Intrigue', this.intrigue)
            embed.addField('Age', this.age)
            if (this.magicalProperty)
                embed.addField('Magical Property', this.magicalProperty)
            embed.addField('Value', this.value)
            embed.setColor(this.colour.hex)
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
            embed.addField('Value', this.value)
        }
        return embed
    }
}
