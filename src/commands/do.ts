import { Message } from 'discord.js'
import { logger } from '../logger'
import nlp from 'compromise'

export default async function _do(message: Message, args: string[]) {
    logger.debug('Executing command +do')
    const messageString = args.join(' ')
    const sentence = nlp(messageString)
    const proceesedSentence = sentence
        .verbs()
        .toPresentTense()
        .trim()
        .out('text')
    if (proceesedSentence.length < 1) {
        logger.error('No verb detected in sentence: ' + messageString)
        return await message.channel.send(`Purrito cannot ${args[0]}.`)
    }
    return await message.channel.send(`*purrito ${proceesedSentence}*`)
}
