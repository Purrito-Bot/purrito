import { Message } from 'discord.js'

export async function snack(message: Message) {
    await message.channel.send('*purrito snacks*')
}
