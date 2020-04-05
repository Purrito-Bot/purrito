import { Message } from 'discord.js'
import Guild, { GuildSettings } from '../models/guild'
import config from '../config.json'
import equal from 'deep-equal'
import { allConfigAsMessageString } from '../utils'
import { findOrMakeGuild } from '../database'

export async function setConfig(message: Message, args: string[]) {
    let [key, value] = args
    const guildId = message.guild!.id
    const guild = await findOrMakeGuild(guildId)
    const newSettings = { ...guild.settings }

    try {
        updateSettings(key, value, newSettings)
    } catch (error) {
        return message.channel.send(error.message)
    }

    if (!equal(guild.settings, newSettings)) {
        guild.settings = newSettings
        await guild.save()
    }
    await message.channel.send(
        'Server config updated:\n\n' + allConfigAsMessageString(guild.settings)
    )
}

function updateSettings(key: string, value: string, settings: GuildSettings) {
    switch (key as keyof typeof config.defaultSettings) {
        case 'randomSpeechProbability':
            updateRandomSpeechProbability(value, settings)
            break
        default:
            throw new Error(`Invalid config option "${key}"`)
    }
}

function updateRandomSpeechProbability(value: string, settings: GuildSettings) {
    const probability = parseRandomSpeechProbability(value)
    if (probability) {
        settings.randomSpeechProbability = probability
    } else {
        throw new Error(
            `Invalid probability "${value}". Must be a float between 0 and 1 inclusive.`
        )
    }
}

function parseRandomSpeechProbability(value: string): number | null {
    const probability = parseFloat(value)
    if (
        !probability ||
        isNaN(probability) ||
        probability < 0 ||
        probability > 1
    ) {
        return null
    } else {
        return probability
    }
}
