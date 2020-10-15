import { MessageEmbed } from 'discord.js'

export type IMonster = {
    name: string
    meta: string
    'Armor Class': string
    'Hit Points': string
    Speed: string
    STR: string
    STR_mod: string
    DEX: string
    DEX_mod: string
    CON: string
    CON_mod: string
    INT: string
    INT_mod: string
    WIS: string
    WIS_mod: string
    CHA: string
    CHA_mod: string
    'Saving Throws'?: string
    Skills?: string
    'Damage Immunities'?: string
    Senses: string
    Languages: string
    xp: number
    Actions?: string
    'Legendary Actions'?: string
    img_url: string
    environments?: Environment[]
}

export class Monster {
    name: string
    meta: string
    'Armor Class': string
    'Hit Points': string
    Speed: string
    STR: string
    STR_mod: string
    DEX: string
    DEX_mod: string
    CON: string
    CON_mod: string
    INT: string
    INT_mod: string
    WIS: string
    WIS_mod: string
    CHA: string
    CHA_mod: string
    'Saving Throws'?: string
    Skills?: string
    'Damage Immunities'?: string
    Senses: string
    Languages: string
    xp: number
    Actions?: string
    'Legendary Actions'?: string
    img_url: string
    environments?: Environment[]

    constructor(monster: IMonster) {
        this.name = monster.name
        this.meta = monster.meta
        this['Armor Class'] = monster['Armor Class']
        this['Hit Points'] = monster['Hit Points']
        this.Speed = monster.Speed
        this.STR = monster.STR
        this.STR_mod = monster.STR_mod
        this.DEX = monster.DEX
        this.DEX_mod = monster.DEX_mod
        this.CON = monster.CON
        this.CON_mod = monster.CON_mod
        this.INT = monster.INT
        this.INT_mod = monster.INT_mod
        this.WIS = monster.WIS
        this.WIS_mod = monster.WIS_mod
        this.CHA = monster.CHA
        this.CHA_mod = monster.CHA_mod
        this['Saving Throws'] = monster['Saving Throws']
        this.Skills = monster.Skills
        this['Damage Immunities'] = monster['Damage Immunities']
        this.Senses = monster.Senses
        this.Languages = monster.Languages
        this.xp = monster.xp
        this.Actions = monster.Actions
        this['Legendary Actions'] = monster['Legendary Actions']
        this.img_url = monster.img_url
        this.environments = monster.environments
    }

    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
        embed.setTitle(this.name)
        embed.setDescription([
            this.meta,
            `Armor Class: ${this['Armor Class']}`,
            `Hit Points: ${this['Hit Points']}`,
            `Speed: ${this.Speed}`,
            ,
        ])

        embed.addField('Stats', [
            `Strength: ${this.STR} ${this.STR_mod}`,
            `Dexterity: ${this.DEX} ${this.DEX_mod}`,
            `Constitution: ${this.CON} ${this.CON_mod}`,
            `Intelligence: ${this.INT} ${this.INT_mod}`,
            `Wisdom: ${this.WIS} ${this.WIS_mod}`,
            `Charisma: ${this.CHA} ${this.CHA_mod}`,
        ])

        embed.addField('Abilities', [
            `Senses: ${this.Senses}`,
            `Languages: ${this.Languages}`,
        ])

        if (this['Saving Throws']) {
            embed.addField('Saving Throws', this['Saving Throws'])
        }
        if (this.Skills) {
            embed.addField('Skills', this.Skills)
        }

        if (this['Damage Immunities'])
            embed.addField('Damage Immunites', this['Damage Immunities'])

        // Actions - this can get quite long so splitting it into chunks of 1024 length
        if (this.Actions) {
            // Remove all the HTML
            const formattedActions = this.Actions.replace(/<em>/g, '*')
                .replace(/<\/em>/g, '*')
                .replace(/<strong>/g, '**')
                .replace(/<\/strong>/g, '**')
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '\n')

            // Calculate how many chunks there are
            const numberOfChunks = Math.ceil(formattedActions.length / 1024)
            const actionSubStrings = new Array(numberOfChunks)

            // Break the string into the neccessary amount of chunks
            for (let i = 0, o = 0; i < numberOfChunks; ++i, o += 1024) {
                actionSubStrings[i] = formattedActions.substr(o, 1024)
            }

            actionSubStrings.forEach((action, index) => {
                if (index === 0) {
                    embed.addField('Actions', action)
                } else {
                    embed.addField(
                        'Actions continued....',
                        action
                    )
                }
            })
        }

        // Legendary actions
        if (this['Legendary Actions']) {
            // Remove all the HTML
            const formattedActions = this['Legendary Actions']
                .replace(/<em>/g, '*')
                .replace(/<\/em>/g, '*')
                .replace(/<strong>/g, '**')
                .replace(/<\/strong>/g, '**')
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '\n')

            // Calculate how many chunks there are
            const numberOfChunks = Math.ceil(formattedActions.length / 1024)
            const actionSubStrings = new Array(numberOfChunks)

            // Break the string into the neccessary amount of chunks
            for (let i = 0, o = 0; i < numberOfChunks; ++i, o += 1024) {
                actionSubStrings[i] = formattedActions.substr(o, 1024)
            }

            actionSubStrings.forEach((action, index) => {
                if (index === 0) {
                    embed.addField(
                        'Legendary Actions',
                        action
                    )
                } else {
                    embed.addField(
                        'Legendary Actions continued....',
                        action
                    )
                }
            })
        }

        embed.setThumbnail(this.img_url)

        return embed
    }
}

export type Environment =
    | 'ARCTIC'
    | 'COASTAL'
    | 'DESERT'
    | 'FOREST'
    | 'GRASSLAND'
    | 'HILL'
    | 'MOUNTAIN'
    | 'SWAMP'
    | 'UNDERDARK'
    | 'UNDERWATER'
    | 'URBAN'
