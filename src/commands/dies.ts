import { Message } from 'discord.js'
import moment from 'moment'
import { logger } from '../logger'
import { findOrMakeGuild } from '../database'

export default async function die(message: Message) {
    const guildId = message.guild!.id
    const guild = await findOrMakeGuild(guildId)
    let response: string
    guild.purritoState.lives = guild.purritoState.lives - 1
    if (guild.purritoState.lives >= 1) {
        response = `*purrito dies.* He has ${guild.purritoState.lives} ${
            guild.purritoState.lives > 1 ? 'lives' : 'life'
        } left. :skull_crossbones:`
    } else if (guild.purritoState.lives === 0) {
        const timeOfDeath = moment()
        guild.purritoState.timeOfDeath = timeOfDeath.toDate()
        response = `*purrito dies.* He's unresponsive... Time of death: ${timeOfDeath.toLocaleString()}`
    } else {
        guild.purritoState.lives = 0
        response = `How do you kill that which has no life?`
    }
    await guild.save()
    return await message.channel.send(response)
}
