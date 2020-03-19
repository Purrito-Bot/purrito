import { Message } from 'discord.js'
import { attack } from './commands/attack'
import { ping } from './commands/ping'
import config from './config.json'
import { snack } from './commands/snack'
import { defend } from './commands/defend'
import { speak } from './commands/speak'

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
export function executeCommand(message: Message): void {
    const [command, args] = parseMessage(message)
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
        case 'speak':
            speak(message)
    }
}
