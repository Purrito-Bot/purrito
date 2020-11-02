import { MessageEmbed } from 'discord.js'
import { PrintableObject } from './printableObject'

export interface ISpell {
    name: string
    description: string
    higherLevel?: string
    page: string
    range: string
    components: string
    material?: string
    ritual: boolean
    duration: string
    concentration: boolean
    castingTime: string
    level: string
    school: string
    class: string
    circles?: string
    archetype?: string
    patron?: string
    domains?: string
}

export class Spell implements PrintableObject {
    name: string
    description: string
    higherLevel?: string
    page: string
    range: string
    components: string
    material?: string
    ritual: boolean
    duration: string
    concentration: boolean
    castingTime: string
    level: string
    school: string
    class: string
    circles?: string
    archetype?: string
    patron?: string
    domains?: string

    constructor(spell: ISpell) {
        this.name = spell.name
        this.description = spell.description
        this.higherLevel = spell.higherLevel
        this.page = spell.page
        this.range = spell.range
        this.components = spell.components
        this.material = spell.material
        this.ritual = spell.ritual
        this.duration = spell.duration
        this.concentration = spell.concentration
        this.castingTime = spell.castingTime
        this.level = spell.level
        this.school = spell.school
        this.class = spell.class
        this.circles = spell.circles
        this.archetype = spell.archetype
        this.patron = spell.patron
        this.domains = spell.domains
    }

    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()

        embed.setTitle(this.name)
        embed.setDescription(this.description)
        if (this.higherLevel)
            embed.addField('At higher levels', this.higherLevel)
        embed.addField('Range', this.range)
        embed.addField("Components", this.components)
        if(this.material) embed.addField("Material", this.material)
        embed.addField("Ritual", this.ritual ? "Yes" : "No")
        embed.addField("Duration", this.duration)
        embed.addField("Concentration", this.concentration ? "Yes": "No")
        embed.addField("Casting time", this.castingTime)
        embed.addField("Level", this.level)

        return embed
    }
}
