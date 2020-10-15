import { Message } from 'discord.js'
import config from '../config.json'
import { Dice } from '@ensemblebr/dice'

/**
 * Given +dice and a command e.g. 1d20 roll the dice
 * @param message the message from the discord channel
 */
export function rollDice(message: Message) {
    const command = message.content.slice(`${config.prefix}dice`.length).trim()

    if (!command) {
        return message.reply(`looks like you dropped your dice`)
    }

    // commands[0] roll
    // commands [1] reason
    const commands = command.split('!')
    const reason = commands[1]

    const dice = new Dice()
    const result = dice.roll(commands[0])

    if (result.errors.length > 0) {
        return message.reply(`c'mon ...${command}?`)
    }

    message.reply(
        `Results: ${result.renderedExpression} Total: ${
            result.total
        } ${reason ? `reason: ${reason.trim()}` : ''}`
    )
}
