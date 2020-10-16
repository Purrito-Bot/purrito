import { MessageEmbed } from 'discord.js'
import { ValuedDescriptor } from './itemDescriptor'
import { ItemType } from './itemType'
import { PrintableObject } from './printableObject'

export interface IItem {
    type: ItemType
    material?: string
    colour: string
    descriptors: string[]
    condition: ValuedDescriptor
    size: ValuedDescriptor
    renown: ValuedDescriptor
    age: ValuedDescriptor
}

export class Item implements PrintableObject {
    type: string
    material?: string
    colour: string
    descriptors: string[]
    condition: string
    size: string
    renown: string
    age: string
    value: number

    constructor(item: IItem) {
        this.type = item.type.label
        this.material = item.material
        this.colour = item.colour
        this.descriptors = item.descriptors
        this.condition = item.condition.label
        this.size = item.size.label
        this.renown = item.renown.label
        this.age = item.age.label
        this.value =
            item.condition.value +
            item.age.value +
            item.renown.value +
            item.size.value
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
                'Use the value as a guideline on what GP value to assign it for your party. This number will range between 0 (trash) to 34 (god like item)'
            )
            if (this.material) embed.addField('Material', this.material)
            embed.addField('Colour', this.colour)
            embed.addField('Descriptors', this.descriptors)
            embed.addField('Condition', this.condition)
            embed.addField('Size', this.size)
            embed.addField('Renown', this.renown)
            embed.addField('Age', this.age)
            embed.addField('Value', this.value)
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
