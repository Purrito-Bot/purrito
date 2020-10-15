import { Message, MessageEmbed } from 'discord.js'
import config from '../config.json'
import { Dice, DiceResult } from '@ensemblebr/dice'
import diceCommands from '../reference/diceHelp.json'

/**
 * Given +dice and a command e.g. 1d20 roll the dice
 * @param message the message from the discord channel
 */
export function rollDice(message: Message) {
    const command = message.content.slice(`${config.prefix}dice`.length).trim()

    if (!command) {
        return message.reply(`looks like you dropped your dice`)
    }

    if (command.trim() === 'help') {
        return message.channel.send(new MessageEmbed(diceCommands))
    }

    // commands[0] roll
    // commands [1] reason
    const commands = command.split('!')
    const reason = commands[1]

    const dice = new Dice()
    let result: DiceResult
    try {
        result = dice.roll(commands[0])
    } catch {
        return message.reply(`cmon ...${command}`)
    }

    if (result.errors.length > 0) {
        return message.reply(`c'mon ...${command}?`)
    }

    message.reply(
        `Results: ${result.renderedExpression} Total: ${result.total} ${
            reason ? `Reason: ${reason.trim()}` : ''
        }`
    )
}
