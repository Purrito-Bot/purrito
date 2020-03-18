import { Message } from 'discord.js'
import { Command } from './command'

export class AttackCommand implements Command {
    async executeCommand(message: Message) {
        await message.channel.send('*purrito attacks*')
    }
}
