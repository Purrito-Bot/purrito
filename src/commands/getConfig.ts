import { Message } from 'discord.js'
import config from '../config.json'
import Guild, { GuildSettings } from '../models/guild'
import { allConfigAsMessageString } from '../utils/utils'

export async function getConfig(message: Message, args: string[]) {
    const [key] = args
    const guild = await Guild.findByGuildId(message.guild!.id)
    let settings: GuildSettings
    settings = guild ? guild.settings : config.defaultSettings

    let response = ''

    if (key) {
        response = getConfigByKey(key, settings)
    } else {
        response = 'All server config:\n\n' + allConfigAsMessageString(settings)
    }
    return await message.channel.send(response)
}

function getConfigByKey(key: string, settings: GuildSettings) {
    const value = (settings as any)[key]
    let response: string
    if (value) {
        response = `${key}:\t**${value}**`
    } else {
        response = `No config value found for "${key}".`
    }
    return response
}
