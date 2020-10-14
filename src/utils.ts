import { EmojiResolvable, Message, MessageReaction, User } from 'discord.js'
import config from './config.json'
import Guild, { GuildSettings } from './models/guild'
import { ValuedDescriptor } from './models/valuedDescriptor'

/**
 * @description Parse the message into a command and a list of arguments which have been provided
 * e.g. if we have the message "+say Is this the real life?" , we'll get the following:
 * command = say
 * args = ["Is", "this", "the", "real", "life?"]
 * @param message - this is the Discord message
 */
export function parseMessage(message: Message): [string, string[]] {
    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g)
    const command = args.shift()!.toLowerCase()

    return [command, args]
}

/**
 * Turn the settings object into a more readable string to be printed in discord
 * @param settings the settings to be printed
 */
export function allConfigAsMessageString(settings: GuildSettings) {
    let response = ''
    Object.keys(config.defaultSettings).forEach(key => {
        const value = (settings as any)[key]
        if (value) {
            response += `${key}:\t**${value}**\n`
        }
    })

    return response
}

/**
 * Find the config for a given Guild, if the guild does not exist create a new one in MongoDB
 * @param guildId the unique ID of the Guild/Server
 */
export async function findOrMakeGuild(guildId: string) {
    // Try to get existing guild config
    let guild = await Guild.findOne({ guildId: guildId })
    if (!guild) {
        // Create config if none exists yet for this guild
        guild = new Guild({
            guildId: guildId,
            settings: config.defaultSettings,
            purritoState: config.defaultPurritoState,
        })
    }
    return guild
}

/**
 * When given an array, pick a random element from it and return to the user
 * @param array the array
 */
export function getRandomValueFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * When generated an item, some descriptors are weighted, to give them more / less
 * chance to appear than others. This function will created that weighted list
 * @param descriptors descriptors from which to created a weighted list
 */
export function createdWeightedList(
    descriptors: ValuedDescriptor[]
): ValuedDescriptor[] {
    let weightedList: ValuedDescriptor[] = []

    descriptors.forEach(descriptor => {
        const numberToAdd = descriptor.weight

        for (let index = 0; index < numberToAdd; index++) {
            weightedList.push(descriptor)
        }
    })

    return weightedList
}

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
    const botMessage =  await originMessage.reply(responseMessage)

    let userReaction: MessageReaction | undefined

    emojis.forEach(emoji => botMessage.react(emoji))

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
            if(deleteOnCompletion) botMessage.delete();
        })

        .catch(() =>
            originMessage.channel.send(
                failureToRespondMessage || 'please respond'
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

            if(deleteOnCompletion) botMessage.delete();
        })
        .catch(() =>
            message.channel.send(failureToRespondMessage || 'please respond')
        )

    return userResponse
}
