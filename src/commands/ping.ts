import { Message } from 'discord.js'

export async function ping(message: Message) {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    const m = await message.channel.send('Ping?')
    m.edit(
        `Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`
    )
}
