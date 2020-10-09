import { Message } from 'discord.js'
import { Item } from '../models/item'

/**
 * Given +generate item, generate an item based on the sets of data
 * @param message
 * @param args
 */
export async function generateItem(message: Message, args?: string[]) {
    let messageToReturn: string
    const randomItem: Item = new Item()

    let outputVariant: string | undefined
    // arg[0] we know will be "item" whereas arg[1] can be used to specify the
    // variant. (lite or normal)
    if (Array.isArray(args) && args.length > 0) {
        if (args[1]) outputVariant = args[1]
    }

    switch (outputVariant) {
        case 'lite':
            messageToReturn = randomItem.formateLiteMessage()
            break
        default:
            messageToReturn = randomItem.formatItemForMessage()
    }

    await message.channel.send(messageToReturn)
}
