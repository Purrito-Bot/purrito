import { Message } from 'discord.js'

export async function speak(message: Message) {
    const random = Math.random()
    if (random < 0.001) {
        await message.channel.send('DEATH TO MY ENEMIES.')
    } else if (random < 0.33) {
        await message.channel.send('Purrrrr.')
    } else if (random < 0.66) {
        await message.channel.send('Mrow.')
    } else if (random < 1) {
        await message.channel.send('Meow.')
    }
}
