import { Message } from 'discord.js'
import config from './config.json'
import { Command } from './commands/command'
import { AttackCommand } from './commands/attackCommand'
import { PingCommand } from './commands/pingCommand'

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

export function determineCommand(command: string): Command | undefined {
    let commandClass: Command
    switch (command) {
        case 'attack':
            commandClass = new AttackCommand()
            return commandClass
        case 'ping':
            commandClass = new PingCommand()
            return commandClass
    }
}
