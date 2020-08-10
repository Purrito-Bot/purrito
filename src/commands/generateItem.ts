import { Message } from 'discord.js'
import { Item } from '../models/item'

export async function generateItem(message: Message, args?: string[]) {
    let messageToReturn: string
    const randomItem: Item = new Item()

    let arg1: string | undefined
    if (Array.isArray(args) && args.length > 0) {
        if (args[0].toLocaleLowerCase()) arg1 = args[0]
    }

    switch (arg1) {
        case 'lite':
            messageToReturn = randomItem.formateLiteMessage()
            break
        default:
            messageToReturn = randomItem.formatItemForMessage()
    }

    await message.channel.send(messageToReturn)
}
