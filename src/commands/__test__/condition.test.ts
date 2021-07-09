import { MessageEmbed } from 'discord.js';
import { conditions } from '../../condition';
import config from '../../config.json';
import Condition from '../condition';
import MockDiscord from './testData';

describe('Condition', () => {
  config.prefix = '!';
  conditions.fields = [
    {
      name: 'Test',
      value: ['Value1'],
    },
  ];
  const condition = new Condition();
  const discord = new MockDiscord();
  const send = jest.fn();
  discord.getTextChannel().send = send;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    discord.getClient().destroy();
  });

  it('initialises with correct values', () => {
    expect(condition.name).toStrictEqual('condition');
    expect(condition.description).toStrictEqual(
      'Gives information about various conditions. Try !condition paralyzed or !condition to see them all!'
    );
  });

  it('returns information about all conditions', () => {
    discord.getMessage().content = '';

    condition.run(discord.getMessage(), []);

    expect(send).toBeCalledWith(new MessageEmbed(conditions));
  });

  it('returns information about a condition if specified', () => {
    discord.getMessage().content = '';

    condition.run(discord.getMessage(), ['test']);

    expect(send).toBeCalledWith(
      new MessageEmbed({ title: 'Test', description: 'Value1' })
    );
  });

  it('ignores casing of the condition name', () => {
    discord.getMessage().content = '';

    condition.run(discord.getMessage(), ['TEST']);

    expect(send).toBeCalledWith(
      new MessageEmbed({ title: 'Test', description: 'Value1' })
    );
  });

  it('returns an error if condition is unrecognised', () => {
    discord.getMessage().content = '';

    condition.run(discord.getMessage(), ['mess']);

    expect(send).toBeCalledWith(
      new MessageEmbed({
        description: "Couldn't find a match for condition 'mess'",
      })
    );
  });
});
