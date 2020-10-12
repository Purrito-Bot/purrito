import { Message } from 'discord.js'
import config from './config.json'
import Guild, { GuildSettings } from './models/guild'
import { ValuedDescriptor } from './models/valuedDescriptor'

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
 * When generated an item, some descriptors are weighted, to give them more / less
 * chance to appear than others. This function will created that weighted list
 * @param descriptors descriptors from which to created a weighted list
 */
export function createdWeightedList(
    descriptors: ValuedDescriptor[]
): ValuedDescriptor[] {
    let weightedList: ValuedDescriptor[] = []

    descriptors.forEach(descriptor => {
        const numberToAdd = descriptor.weight

        for (let index = 0; index < numberToAdd; index++) {
            weightedList.push(descriptor)
        }
    })

    return weightedList
}

/**
 * Given a string such as '!generate encounter foo bar' with a key of 'foo'
 * pull out the text 'bar'
 * @param haystack the string to extract from
 * @param flagName the name of the flag e.g. 'env'
 */
export function extractFlag(
    haystack: string,
    flagName: string
): string | undefined {
    // The needle in our haystack
    let needle: string | undefined

    // Convert the flag name into a regular expression
    const regex = new RegExp(`(?:${flagName}\\s+)(\\w*)`)
    // Try and match this regexp using the haystack string
    const regexArray = haystack.match(regex)

    // if there's a match, assume we want the first match
    if (regexArray) {
        needle = regexArray[1]
    }

    return needle
}
