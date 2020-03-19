import { Message } from 'discord.js'

export async function defend(message: Message) {
    await message.channel.send('*purrito defends*')
}
