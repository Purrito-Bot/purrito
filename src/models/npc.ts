import { MessageEmbed } from 'discord.js'
import { PrintableObject } from './printableObject'

export interface INPC {
    name: string
    race: string
    profession: string
    appearance: string[]
    personality: string[]
}

/**
 * Represents an NPC, with a name race and a few other bits
 */
export class NPC implements PrintableObject {
    name: string
    race: string
    profession: string
    appearance: string[]
    personality: string[]

    constructor(iNpc: INPC) {
        this.name = iNpc.name
        this.race = iNpc.race
        this.profession = iNpc.profession
        this.appearance = iNpc.appearance
        this.personality = iNpc.personality
    }

    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
        embed.setTitle(this.name)
        embed.setDescription(`A ${this.race} ${this.profession}.`)
        embed.addField('Appearance', this.appearance)
        embed.addField('Personality', this.personality)
        return embed
    }
}
