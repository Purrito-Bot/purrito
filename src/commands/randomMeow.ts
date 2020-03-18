import { Message } from 'discord.js'

export async function randomMeow(message: Message) {
    if (Math.random() < 0.05) {
        const random = Math.random()
        if (random < 0.001) {
            await message.channel.send('DEATH TO MY ENEMIES.')
        } else if (random < 0.3) {
            await message.channel.send('Purrrrr.')
        } else if (random < 0.6) {
            await message.channel.send('Mrow.')
        } else if (random < 1) {
            await message.channel.send('Meow.')
        }
    }
}
