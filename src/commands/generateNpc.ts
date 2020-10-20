import { Message } from 'discord.js'
import { _generateNPC } from '../utils/npcUtils'

/**
 * Given +generate NPC, generate an NPC on the sets of data
 * @param message
 * @param args
 */
export async function generateNPC(message: Message, args?: string[]) {
    const randomNPC = _generateNPC()

    return message.channel.send(randomNPC.createEmbed())
}
