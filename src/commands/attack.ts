import { Message } from 'discord.js'

export async function attack(message: Message) {
    await message.channel.send('*purrito attacks*')
}
