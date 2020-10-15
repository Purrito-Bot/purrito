import { Message } from 'discord.js'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { logger } from '../logger'
import { findOrMakeGuild, parseMessage } from '../utils/utils'
import { attack } from './attack'
import { defend } from './defend'
import { describeMonster } from './describe'
import { rollDice } from './dice'
import { die } from './dies'
import { _do } from './do'
import { generate } from './generate'
import { getConfig } from './getConfig'
import { help } from './help'
import { ping } from './ping'
import { resurrect } from './resurrect'
import { setConfig } from './setConfig'
import { snack } from './snack'
import { speak } from './speak'
import { xpBudget } from './xpBudget'

// set up TimeAgo
TimeAgo.addLocale(en)

// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-GB')

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
            generate(message, args)
            break
        case 'xpbudget':
            xpBudget(message, args)
            break
        case 'describe':
            describeMonster(message)
            break
        case 'dice':
            rollDice(message)
            break
        case 'help':
            help(message)
            break
    }
}
