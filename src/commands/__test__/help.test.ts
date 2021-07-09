import { Message, MessageEmbed } from 'discord.js';
import config from '../../config.json';
import { Command } from '../../types/command';
import Help from '../help';

describe('Help', () => {
  const help = new Help();

  const send = jest.fn();
  const author = jest.fn();
  const message = {
    author: {
      send: author,
    },
    channel: {
      id: 'channelId',
      send,
    },
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('initialises with correct values', () => {
    expect(help.name).toStrictEqual('help');
    expect(help.description).toStrictEqual('Returns this helpful message!');
  });

  it('sends message embed to channel', () => {
    help.commands.set('help', help);

    const expected = new MessageEmbed({
      description:
        "Purrito is here for all your D&D needs! Here's what I can do!",
      title: 'Available commands',
      fields: [
        {
          name: `${config.prefix}help`,
          value: 'Returns this helpful message!',
        },
      ],
    });

    help.run(message);

    expect(send).toHaveBeenCalledWith(expected);
  });

  it('sends private message with hidden commands', () => {
    class HiddenCommand extends Command {
      constructor() {
        super({
          hidden: true,
          name: 'Hidden',
          description: 'Test command',
        });
      }
      run(_: Message): void {}
    }

    const hidden = new HiddenCommand();
    help.commands.set('hidden', hidden);
    help.commands.set('help', help);

    help.run(message);

    const expected = new MessageEmbed({
      description:
        "You're getting this message as you have permission to use some hidden commands.",
      title: 'Secret commands',
      fields: [{ name: `${config.prefix}Hidden`, value: 'Test command' }],
    });

    expect(author).toHaveBeenCalledWith(expected);
  });
});
