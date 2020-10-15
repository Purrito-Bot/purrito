import { Message, MessageEmbed } from "discord.js";
import conditions from '../conditions.json'

export function condition(message: Message) {
    return message.channel.send(new MessageEmbed(conditions))
}