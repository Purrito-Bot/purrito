import { Message } from 'discord.js'
import Guild, { GuildSettings } from '../models/guild'
import config from '../config.json'
import equal from 'deep-equal'
import { allConfigAsMessageString } from '../utils'

export async function setConfig(message: Message, args: string[]) {
    let [key, value] = args
    const guildId = message.guild!.id
    // Try to get existing guild config
    let guild = await Guild.findOne({ guildId: guildId })
    if (!guild) {
        // Create config if none exists yet for this guild
        guild = new Guild({
            guildId: guildId,
            settings: config.defaultSettings,
        })
    }
    const newSettings = { ...guild.settings }

    if (key === 'randomSpeechProbability') {
        const probability = parseFloat(value)
        if (
            !probability ||
            isNaN(probability) ||
            probability < 0 ||
            probability > 1
        ) {
            return await message.channel.send(
                `Invalid probability "${value}". Must be a float between 0 and 1 inclusive.`
            )
        } else {
            newSettings.randomSpeechProbability = probability
        }
    } else {
        return await message.channel.send(`Invalid config option "${key}"`)
    }

    if (!equal(guild.settings, newSettings)) {
        guild.settings = newSettings
        await guild.save()
    }
    await message.channel.send(
        'Server config updated:\n\n' + allConfigAsMessageString(guild.settings)
    )
}
