import { Message } from 'discord.js'
import config from '../config.json'
import { ISpell, Spell } from '../models/spell'
import spells from '../reference/spells.json'

/**
 * Given +spell and a spell name, find that spell and print
 * the info in the channel
 * @param message the message - used to return a message to the correct channel
 */
export async function describeSpell(message: Message) {
    let spellName: string | undefined

    spellName = message.content.slice(`${config.prefix}spell`.length).trim()

    if (!spellName)
        return await message.reply(
            'what spell are you looking for? try `+spell fireball`'
        )

    const json: ISpell | undefined = spells.find(
        (monster) => monster.name.toLowerCase() === spellName?.toLowerCase()
    )

    if (json) {
        return message.channel.send(new Spell(json).createEmbed())
    } else {
        return await message.reply(
            `couldn't find ${spellName}, probably having a cat nap`
        )
    }
}
