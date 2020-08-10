import { Message } from 'discord.js'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { attack } from './commands/attack'
import { defend } from './commands/defend'
import die from './commands/dies'
import _do from './commands/do'
import { generateItem } from './commands/generateItem'
import { getConfig } from './commands/getConfig'
import { ping } from './commands/ping'
import resurrect from './commands/resurrect'
import { setConfig } from './commands/setConfig'
import { snack } from './commands/snack'
import { speak } from './commands/speak'
import config from './config.json'
import { logger } from './logger'
import Guild, { GuildSettings } from './models/guild'
import { ValuedDescriptor } from './models/valuedDescriptor'

// set up TimeAgo
TimeAgo.addLocale(en)

// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-GB')

/**
 * @description Parse the message into a command and a list of arguments which have been provided
 * e.g. if we have the message "+say Is this the real life?" , we'll get the following:
 * command = say
 * args = ["Is", "this", "the", "real", "life?"]
 * @param message - this is the Discord message
 */
function parseMessage(message: Message): [string, string[]] {
    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g)
    const command = args.shift()!.toLowerCase()

    return [command, args]
}

/**
 * @description given a message - determine what command is being run and execute it
 * @param message
 */
export async function executeCommand(message: Message) {
    const [command, args] = parseMessage(message)
    logger.debug(`Command parsed: '${command}'`)
    // Check if Purrito has run out of lives. Only allow resurrect if so.
    const guild = await findOrMakeGuild(message.guild!.id)
    if (guild.purritoState.lives <= 0 && command !== 'resurrect') {
        return await message.channel.send(
            `Purrito died ${timeAgo.format(
                guild.purritoState.timeOfDeath
            )}. It's time to move on.`
        )
    }
    switch (command) {
        case 'attack':
            attack(message)
            break
        case 'ping':
            ping(message)
            break
        case 'snack':
        case 'snacc':
            snack(message)
            break
        case 'defend':
            defend(message)
            break
        case 'speak':
            speak(message)
            break
        case 'do':
            _do(message, args)
            break
        case 'setconfig':
            setConfig(message, args)
            break
        case 'getconfig':
            getConfig(message, args)
            break
        case 'die':
            die(message)
            break
        case 'resurrect':
            resurrect(message)
            break
        case 'generate':
            generateItem(message, args)
            break
    }
}

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

export function getRandomValueFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

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
