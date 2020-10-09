import { Message } from 'discord.js'
import { logger } from '../logger'
import { generateItem } from './generateItem'

/**
 * When receiving a message with +generate, determine what the user wants to generate.
 * @param message
 * @param args
 */
export default async function generate(message: Message, args: string[]) {
    logger.debug('Executing command +generate')

    let generationType: string | undefined
    // arg[0] is used to tell Purrito what to generate
    if (Array.isArray(args) && args.length > 0) {
        if (args[0]) generationType = args[0]
    }

    switch (generationType) {
        case 'item':
            generateItem(message, args)
            break
    }
}
