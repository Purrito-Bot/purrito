import { Message } from 'discord.js'
import { _generateItem } from '../utils/itemUtils'

/**
 * Given +generate item, generate an item based on the sets of data
 * @param message
 * @param args
 */
export async function generateItem(message: Message, args?: string[]) {
    const randomItem = _generateItem()

    let outputVariant: string | undefined
    // arg[0] we know will be "item" whereas arg[1] can be used to specify the
    // variant. (lite or normal)
    if (Array.isArray(args) && args.length > 0) {
        if (args[1]) outputVariant = args[1]
    }

    switch (outputVariant) {
        case 'lite':
            message.channel.send(randomItem.createLiteEmbed())
            break
        default:
            if (randomItem.value > 90) message.channel.send('🌟 MEOW 🌟')
            return message.channel.send(randomItem.createEmbed())
    }
}
