import { Message } from 'discord.js'
import { Descriptors } from '../reference'
import { getRandomValueFromArray } from '../utils/utils'

/**
 * Give a random descriptor back to the user from the reference data
 * @param message
 */
export function randomDescriptor(message: Message, args: string[]) {
    let messageToReturn: string[] = []
    let numberOfDescriptors = parseInt(args[0])

    if (isNaN(numberOfDescriptors)) {
        numberOfDescriptors = 3
    } else if (numberOfDescriptors > 10) {
        numberOfDescriptors = 10
    }

    for (let i = 0; i < numberOfDescriptors; i++) {
        messageToReturn.push(getRandomValueFromArray(Descriptors))
    }

    return message.reply(messageToReturn.join(', '))
}
