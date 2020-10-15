import { Message, MessageEmbed } from 'discord.js'
import helpJson from '../reference/help.json'

/**
 * Given the +help command, return the user a list of available commands
 * @param message the message - used to return a message to the correct channel
 */
export function help(message: Message) {
    return message.channel.send(new MessageEmbed(helpJson))
}
