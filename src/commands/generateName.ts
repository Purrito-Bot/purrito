import { EmojiResolvable, Message, MessageReaction, User } from 'discord.js'

function createEmojiFilter(emoji: EmojiResolvable[], userId: string) {
    return (react: MessageReaction, user: User) => {
        return emoji.includes(react.emoji.name) && user.id === userId
    }
}

export async function generateName(message: Message) {
    let gender: string | undefined
    let species: string | undefined

    const genderFilter = createEmojiFilter(['👨', '👩'], message.author.id)
    const speciesFilter = createEmojiFilter(
        ['👨', '👩', '🦒'],
        message.author.id
    )

    const genderResponse = await message.reply('man or woman?')
    await genderResponse.react('👩')
    await genderResponse.react('👨')

    await genderResponse
        .awaitReactions(genderFilter, {
            max: 1,
            time: 60000,
            errors: ['time'],
        })
        .then(collected => {
            const reaction = collected.first()

            if (reaction?.emoji.name === '👨') {
                gender = 'man'
            } else {
                gender = 'woman'
            }
        })
        .catch(() => {
            message.reply('please react within a minute')
        })

    if (!gender) return

    const speciesResponse = await message.reply('human or giraffe?')
    await speciesResponse.react(gender === 'woman' ? '👩' : '👨')
    await speciesResponse.react('🦒')

    await speciesResponse
        .awaitReactions(speciesFilter, {
            max: 1,
            time: 60000,
            errors: ['time'],
        })
        .then(collected => {
            const reaction = collected.first()

            if (reaction?.emoji.name === '🦒') {
                species = 'giraffe'
            } else {
                species = 'human'
            }
        })
        .catch(() => {
            message.reply('please react within a minute')
            return
        })

    if (!species) return

    message.reply(
        `your ${gender} ${species} name is: ${
            gender === 'woman' ? 'Carly' : 'Carl'
        } ${species === 'human' ? 'Twolegs' : 'Longneck'}`
    )
}
