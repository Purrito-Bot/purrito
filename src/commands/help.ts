import { Collection, Message, MessageEmbed } from 'discord.js';
import { Purrito } from '../client';
import { Command, CommandsCollection } from '../types/command';
import { checkUserCanRun } from '../shared/permissions';

export default class extends Command {
  commands: CommandsCollection = new Collection();

  constructor() {
    super({
      name: 'help',
      description: 'Returns this helpful message!',
    });
  }

  run(message: Message): void {
    const publicHelp = new MessageEmbed();
    const privateHelp = new MessageEmbed();

    publicHelp.setTitle('Available commands');
    publicHelp.setDescription(
      "Purrito is here for all your D&D needs! Here's what I can do!"
    );

    privateHelp.setTitle('Secret commands');
    privateHelp.setDescription(
      "You're getting this message as you have permission to use some hidden commands."
    );

    // Check the user can run a command before giving them info on it
    this.commands
      .filter(
        (command) =>
          checkUserCanRun(message.member!, command) && !command.hidden
      )
      .forEach((command) =>
        publicHelp.addField(`!${command.name}`, command.description)
      );

    // Do the same for hidden commands
    this.commands
      .filter(
        (command) =>
          checkUserCanRun(message.member!, command) && !!command.hidden
      )
      .forEach((command) =>
        privateHelp.addField(`!${command.name}`, command.description)
      );

    message.channel.send(publicHelp);

    if (privateHelp.fields.length > 0) {
      message.author.send(privateHelp);
    }
  }

  /* istanbul ignore next */
  init(client: Purrito) {
    this.commands = client.commands;
  }
}
