import { MessageEmbed } from 'discord.js'
import { PrintableObject } from './printableObject'

export class Song implements PrintableObject {
    title: string
    url: string
    description: string
    lengthInSeconds: string

    constructor(
        title: string,
        url: string,
        description: string,
        lengthInSeconds: string
    ) {
        this.title = title
        this.url = url
        this.description = description
        this.lengthInSeconds = lengthInSeconds
    }
    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()

        embed.setTitle(this.title)
        embed.setDescription(this.description)
        embed.setFooter(`Length: ${this.lengthInSeconds} seconds`)

        return embed
    }
}
