import { Message } from 'discord.js'
import { Command } from '../types/command'

export default class extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Calculates latency between discord and bot.',
            permissions: ['ADMINISTRATOR'],
        })
    }

    async run(message: Message) {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        const m = await message.channel.send('Ping')
        m.edit(
            `Pong! Latency is ${
                m.createdTimestamp - message.createdTimestamp
            }ms.`
        )
    }
}
