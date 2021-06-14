import { Message } from 'discord.js'
import { prefix } from '../config.json'
import { logger } from '../logger'
import { CommandsCollection } from '../types/command'
import { checkUserCanRun, parseMessage } from '../utils/message'

export default function (message: Message, commands: CommandsCollection) {
    // Ignore bots, messages from outside guilds and messages without the prefix
    if (
        !message.content.startsWith(prefix) ||
        message.author.bot ||
        !message.guild
    ) {
        return
    }

    logger.debug('Entered on message.')

    const { command, args } = parseMessage(message)

    const runnableCommand = commands.get(command)

    // Check the user has permissions to run the command before executing it
    if (runnableCommand && checkUserCanRun(message.member!, runnableCommand)) {
        if (runnableCommand.subCommands && args.length > 0) {
            const subcommand = args.splice(0, 1)[0]
            if (runnableCommand[subcommand]) {
                runnableCommand[subcommand](message, args)
                return
            }
        }
        runnableCommand.run(message, args)
    }
}
