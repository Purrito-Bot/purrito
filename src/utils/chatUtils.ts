import { Message, EmojiResolvable, MessageReaction, User } from 'discord.js'
import { logger } from '../logger'

/**
 * Reply to a message, asking for a reaction from a user
 * @param originMessage the origin message, used to reply and keep track of the channel etc.
 * @param responseMessage what the message the bot will respond with
 * @param emojis the emojis allowed in the reaction
 * @param allowOtherUsers can other users react or just the original user?
 * @param failureToRespondMessage the message to display if there's no response
 */
export async function askForReaction(
    originMessage: Message,
    responseMessage: string,
    emojis: EmojiResolvable[],
    deleteOnCompletion?: boolean,
    allowOtherUsers?: boolean,
    failureToRespondMessage?: string
): Promise<MessageReaction | undefined> {
    const botMessage = await originMessage.reply(responseMessage)

    let userReaction: MessageReaction | undefined

    emojis.forEach(async emoji => {
        await botMessage.react(emoji).catch(() => {
            logger.debug('Message removed before Purrito could react')
        })
    })

    const filter = (reaction: MessageReaction, user: User) => {
        if (!allowOtherUsers) {
            return (
                emojis.includes(reaction.emoji.name) &&
                user.id === originMessage.author.id
            )
        } else {
            return emojis.includes(reaction.emoji.name)
        }
    }

    await botMessage
        .awaitReactions(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
        })
        .then(collected => {
            userReaction = collected.first()
            if (deleteOnCompletion) botMessage.delete()
        })

        .catch(() =>
            originMessage.channel.send(
                failureToRespondMessage ||
                    '...request expired. going back to sleep'
            )
        )
    return userReaction
}

/**
 * Reply to a message, asking for a response from the user
 * @param originMessage the origin message, used to reply and keep track of the channel etc.
 * @param responseMessage what the message the bot will respond with
 * @param allowOtherUsers can other users react or just the original user?
 * @param failureToRespondMessage the message to display if there's no response
 */
export async function askForTextResponse(
    message: Message,
    responseMessage: string,
    deleteOnCompletion?: boolean,
    allowOtherUsers?: boolean,
    failureToRespondMessage?: string
): Promise<string | undefined> {
    let userResponse: string | undefined
    const botMessage = await message.reply(responseMessage)

    const filter = (response: Message) => {
        if (!allowOtherUsers) {
            return response.author.id === message.author.id
        } else {
            return true
        }
    }

    await botMessage.channel
        .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            const response = collected.first()

            userResponse = response?.content

            if (deleteOnCompletion) botMessage.delete()
        })
        .catch(() =>
            message.channel.send(
                failureToRespondMessage ||
                    '...request expired. going back to sleep'
            )
        )

    return userResponse
}
