import { Message } from 'discord.js'
import {
    Ages,
    Colours,
    Conditions,
    Descriptors,
    Item,
    Materials,
    Renowns,
    Sizes,
    Types,
} from '../models/item'
import { getRandomValueFromArray, createdWeightedList } from '../utils'

export async function generateItem(message: Message, args?: string[]) {
    let messageToReturn: string
    const randomItem: Item = new Item(
        getRandomValueFromArray(Types),
        getRandomValueFromArray(Materials),
        getRandomValueFromArray(Colours),
        [
            getRandomValueFromArray(Descriptors),
            getRandomValueFromArray(Descriptors),
            getRandomValueFromArray(Descriptors),
        ],
        getRandomValueFromArray(createdWeightedList(Conditions)),
        getRandomValueFromArray(createdWeightedList(Sizes)),
        getRandomValueFromArray(createdWeightedList(Renowns)),
        getRandomValueFromArray(createdWeightedList(Ages))
    )

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
