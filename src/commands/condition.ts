import { Message, MessageEmbed } from 'discord.js'
import conditions from '../reference/conditions.json'
import config from '../config.json'

/**
 * Given the +condition command, locate the named condition and send it back
 * @param message the message - primarily used to send to the appropriate channel
 */
export async function condition(message: Message) {
    let conditionName: string

    conditionName = message.content
        .slice(`${config.prefix}condition`.length)
        .trim()

    // Check if they have named a condition
    if (conditionName) {
        // if the user has asked for 'all' return all conditions
        if (conditionName.toLowerCase() === 'all') {
            return message.channel.send(new MessageEmbed(conditions))
        } else {
            // Try and find a match for the condition name
            const conditionData = conditions.fields.find(field =>
                field.name.toLowerCase().includes(conditionName)
            )
            // Convert it into an Embed if found
            if (conditionData) {
                const conditionEmbed = new MessageEmbed()
                conditionEmbed.setTitle(conditionData.name)
                conditionEmbed.setDescription(conditionData.value)
                return message.channel.send(conditionEmbed)
            } else {
                return message.channel.send(
                    `couldn't find a match for condition ${conditionName}`
                )
            }
        }
    } else {
        // If nothing comes after +condition give some helper text
        return message.reply(
            'what condition do you want to learn about? try `+condition paralyzed` or `+condition all` to see all of them'
        )
    }
}
