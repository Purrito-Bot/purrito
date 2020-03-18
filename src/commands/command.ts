import { Message } from 'discord.js'

export interface Command {
    executeCommand(message: Message, args?: string[]): void
}
