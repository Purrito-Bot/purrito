import { Message } from 'discord.js'
import config from '../config.json'
import { IMonster, Monster } from '../models/monster'
import monsters from '../reference/monsters.json'

/**
 * Given +describe and a monster name, find that monster and print
 * the info in the channel
 * @param message the message - used to return a message to the correct channel
 */
export async function describeMonster(message: Message) {
    let monsterName: string | undefined

    monsterName = message.content
        .slice(`${config.prefix}describe`.length)
        .trim()

    if (!monsterName)
        return await message.reply(
            'who do you want me to describe? try `+describe goblin`'
        )

    const json: IMonster | undefined = monsters.find(
        monster => monster.name.toLowerCase() === monsterName?.toLowerCase()
    )

    if (json) {
        return message.channel.send(new Monster(json).createEmbed())
    } else {
        return await message.reply(
            `couldn't find ${monsterName}, probably having a cat nap`
        )
    }
}
