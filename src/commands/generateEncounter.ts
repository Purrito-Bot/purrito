import { Message, EmojiResolvable, MessageReaction, User } from 'discord.js'
import { EncounterDifficulty } from '../models/encounter'
import { Environment } from '../models/monster'
import { _generateEncounter } from './encounter/encounterUtils'
import { extractFlagNumberList, extractFlagWord } from './flagUtils'

function createEmojiFilter(emoji: EmojiResolvable[], userId: string) {
    return (react: MessageReaction, user: User) => {
        return emoji.includes(react.emoji.name) && user.id === userId
    }
}

/**
 * Given +generate encounter, generate an item based on the sets of data
 * @param message the discord message
 * @param args arguments provided for the command
 */
export async function generateEncounter(message: Message, args?: string[]) {
    if (
        Array.isArray(args) &&
        args.length > 0 &&
        args[1] &&
        args[1].toLowerCase() === 'help'
    ) {
        return await message.channel.send(
            'generate an encounter with the following flags\nparty -p = party levels e.g. 1 2 3 (required)\nenv -e = choose an environment e.g. mountain\ndifficulty -d = choose a difficulty e.g. easy'
        )
    }
    const filter = (response: Message) => {
        return response.author.id === message.author.id
    }
    const difficultyFilter = createEmojiFilter(['✔️'], message.author.id)

    let party: string | undefined
    let difficulty: EncounterDifficulty | undefined

    const partyResponse = await message.reply('describe your party e.g. 1 2 3')

    await partyResponse.channel
        .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            const response = collected.first()

            party = response?.content
        })
        .catch(() => message.channel.send('please respond'))

    if (!partyResponse) return

    const difficultyResponse = await message.reply(
        'react with your difficulty!'
    )
    await difficultyResponse.react('✔️')

    await difficultyResponse
        .awaitReactions(difficultyFilter, {
            max: 1,
            time: 30000,
            errors: ['time'],
        })
        .then(collected => {
            const emoji = collected.first()

            if (emoji?.emoji.name === '✔️') {
                difficulty = 'EASY'
            }
        })

    if (!difficulty) return

    message.reply(`${difficulty} encounter with party: ${party}`)
}
