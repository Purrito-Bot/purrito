import { MessageEmbed } from 'discord.js'
import { PrintableObject } from './printableObject'

export class Song implements PrintableObject {
    title: string
    url: string
    description: string
    lengthInSeconds: string
    thumbnailUrl?: string

    constructor(
        title: string,
        url: string,
        description: string,
        lengthInSeconds: string,
        thumbnailUrl: string
    ) {
        this.title = title
        this.url = url
        this.description = description
        this.lengthInSeconds = lengthInSeconds
        this.thumbnailUrl = thumbnailUrl
    }
    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()

        embed.setTitle(this.title)
        embed.setDescription(this.description)
        embed.setFooter(`Length: ${this.lengthInSeconds} seconds`)
        if(this.thumbnailUrl) embed.setThumbnail(this.thumbnailUrl)

        return embed
    }
}
