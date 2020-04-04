import { Message } from 'discord.js'
import { attack } from './commands/attack'
import { ping } from './commands/ping'
import config from './config.json'
import { snack } from './commands/snack'
import { defend } from './commands/defend'
import { speak } from './commands/speak'
import _do from './commands/do'
import { logger } from './logger'
import { setConfig } from './commands/setConfig'
import { getConfig } from './commands/getConfig'
import { GuildSettings, IGuild } from './models/guild'
import Guild, { IGuildModel } from './models/guild'
import die from './commands/dies'
import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago'
import resurrect from './commands/resurrect'
import { removeAllListeners } from 'cluster'
import roll from './commands/roll'

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
            await attack(message)
            break
        case 'ping':
            await ping(message)
            break
        case 'snack':
        case 'snacc':
            await snack(message)
            break
        case 'defend':
            await defend(message)
            break
        case 'speak':
            speak(message)
            break
        case 'do':
            await _do(message, args)
            break
        case 'setconfig':
            await setConfig(message, args)
            break
        case 'getconfig':
            await getConfig(message, args)
            break
        case 'die':
            await die(message)
            break
        case 'resurrect':
            await resurrect(message)
            break
        case 'roll':
            await roll(message)
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
    let guild: IGuild | null = null;
    try {
        //guild = await Guild.findOne({ guildId: guildId })
    }
    catch (e) {
        logger.warn(e)
    }
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
