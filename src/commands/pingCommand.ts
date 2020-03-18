import { Message } from 'discord.js'
import { Command } from './command'

export class PingCommand implements Command {
    async executeCommand(message: Message) {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        const m = await message.channel.send('Ping?')
        m.edit(
            `Pong! Latency is ${m.createdTimestamp -
                message.createdTimestamp}ms.`
        )
    }
}
