import { Message } from 'discord.js'
import Guild, { GuildSettings } from '../models/guild'
import config from '../config.json'
import equal from 'deep-equal'
import { Settings } from 'http2'
import { allConfigAsMessageString } from '../utils'

export async function getConfig(message: Message, args: string[]) {
    const [key] = args
    const guild = await Guild.findByGuildId(message.guild!.id)
    let settings: GuildSettings
    settings = guild ? guild.settings : config.defaultSettings

    let response = ''

    if (key) {
        const value = (settings as any)[key]
        if (value) {
            response = `${key}:\t**${value}**`
        } else {
            response = `No config value found for "${key}".`
        }
    } else {
        response = 'All server config:\n\n' + allConfigAsMessageString(settings)
    }
    return await message.channel.send(response)
}
