import { Command } from '../types/command';
import { prefix } from '../config.json';
import { Message, MessageEmbed } from 'discord.js';
import { conditions } from '../condition';

export default class extends Command {
  constructor() {
    super({
      name: 'condition',
      description: `Gives information about various conditions. Try ${prefix}condition paralyzed or ${prefix}condition to see them all!`,
    });
  }

  async run(message: Message, args: string[]) {
    const messageEmbed = new MessageEmbed();
    const [conditionName] = args;
    if (conditionName) {
      const foundCondition = conditions.fields.find(
        condition =>
          condition.name.toLowerCase().trim() ===
          conditionName.toLowerCase().trim()
      );

      if (foundCondition) {
        messageEmbed.setTitle(foundCondition.name);
        messageEmbed.setDescription(foundCondition.value);
      } else {
        messageEmbed.setDescription(
          `Couldn't find a match for condition '${conditionName}'`
        );
      }
    } else {
      messageEmbed.setTitle(conditions.title);
      messageEmbed.addFields(conditions.fields);
    }
    message.channel.send(messageEmbed);
  }
}
