import { Message } from 'discord.js'
import { logger } from '../logger'
import nlp from 'compromise'

export async function _do(message: Message, args: string[]) {
    logger.debug('Executing command +do')
    const messageString = args.join(' ')
    const sentence = nlp(messageString)
    let proceesedSentence = sentence
        .verbs()
        .toPresentTense()
        .all()
        .text()
    if (args[0] === proceesedSentence.split(' ')[0]) {
        logger.error(
            `No verb detected in sentence "${messageString}". Making best attempt.`
        )
        logger.debug(lazyConjugate(args[0]))
        if (args.length > 1) {
            proceesedSentence = `${lazyConjugate(args[0])} ${args
                .slice(1)
                .join(' ')}`
        } else {
            proceesedSentence = `${lazyConjugate(args[0])}`
        }
    }
    return await message.channel.send(`*purrito ${proceesedSentence}*`)
}

function lazyConjugate(verb: string) {
    return verb + 's'
}
