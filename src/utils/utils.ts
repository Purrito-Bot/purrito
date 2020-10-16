import { Message } from 'discord.js'
import config from '../config.json'
import Guild, { GuildSettings } from '../models/guild'
import { WeightedDescriptor } from '../models/itemDescriptor'

/**
 * @description Parse the message into a command and a list of arguments which have been provided
 * e.g. if we have the message "+say Is this the real life?" , we'll get the following:
 * command = say
 * args = ["Is", "this", "the", "real", "life?"]
 * @param message - this is the Discord message
 */
export function parseMessage(message: Message): [string, string[]] {
    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g)
    const command = args.shift()!.toLowerCase()

    return [command, args]
}

/**
 * Turn the settings object into a more readable string to be printed in discord
 * @param settings the settings to be printed
 */
export function allConfigAsMessageString(settings: GuildSettings) {
    let response = ''
    Object.keys(config.defaultSettings).forEach(key => {
        const value = (settings as any)[key]
        if (value) {
            response += `${key}:\t**${value}**\n`
        }
    })

    return response
}

/**
 * Find the config for a given Guild, if the guild does not exist create a new one in MongoDB
 * @param guildId the unique ID of the Guild/Server
 */
export async function findOrMakeGuild(guildId: string) {
    // Try to get existing guild config
    let guild = await Guild.findOne({ guildId: guildId })
    if (!guild) {
        // Create config if none exists yet for this guild
        guild = new Guild({
            guildId: guildId,
            settings: config.defaultSettings,
            purritoState: config.defaultPurritoState,
        })
    }
    return guild
}

/**
 * When given an array, pick a random element from it and return to the user
 * @param array the array
 */
export function getRandomValueFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * Get an item from a weighted array, accounting for their weight
 * @param items the weighted array
 */
export function getRandomValueFromWeightedArray<T extends WeightedDescriptor>(
    items: T[]
) {
    // Total of all the weights
    const total = items.reduce((a, b) => a + b.weight, 0)

    // Map each item into a accumulative chance
    let accumulator = 0
    const chances = items.map(item => (accumulator = item.weight + accumulator))

    // Roll our dice!
    const diceRoll = Math.random() * total

    // Compare the dice roll with the accumulative chance, pull out the one it landed on
    const result = items[chances.filter(chance => chance <= diceRoll).length]
    return result
}

export function randomIntegerBetweenNumbers(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
