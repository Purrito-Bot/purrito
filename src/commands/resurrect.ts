import { findOrMakeGuild } from '../utils'
import { Message } from 'discord.js'

export async function resurrect(message: Message) {
    const guildId = message.guild!.id
    const guild = await findOrMakeGuild(guildId)
    let response: string
    guild.purritoState.lives = guild.purritoState.lives + 1
    if (guild.purritoState.lives <= 8) {
        guild.purritoState.timeOfDeath = null
        response = `*purrito is resurrected.* he has ${
            guild.purritoState.lives
        } ${guild.purritoState.lives > 1 ? 'lives' : 'life'} left. :heart:`
    } else {
        guild.purritoState.lives = 9
        response = `*purrito can't get any more alive!*`
    }
    await guild.save()
    return await message.channel.send(response)
}
