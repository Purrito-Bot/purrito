import { MessageEmbed } from 'discord.js';
import { conditions } from '../../condition';
import config from '../../config.json';
import Condition from '../condition';

describe('Condition', () => {
  config.prefix = '!';
  conditions.fields = [
    {
      name: 'Test',
      value: ['Value1'],
    },
  ];

  const condition = new Condition();
  const send = jest.fn();
  const message = {
    channel: {
      id: 'channelId',
      send,
    },
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('initialises with correct values', () => {
    expect(condition.name).toStrictEqual('condition');
    expect(condition.description).toStrictEqual(
      'Gives information about various conditions. Try !condition paralyzed or !condition to see them all!'
    );
  });

  it('returns information about all conditions', () => {
    condition.run(message, []);

    expect(send).toBeCalledWith(new MessageEmbed(conditions));
  });

  it('returns information about a condition if specified', () => {
    condition.run(message, ['test']);

    expect(send).toBeCalledWith(
      new MessageEmbed({ title: 'Test', description: 'Value1' })
    );
  });

  it('ignores casing of the condition name', () => {
    condition.run(message, ['TEST']);

    expect(send).toBeCalledWith(
      new MessageEmbed({ title: 'Test', description: 'Value1' })
    );
  });

  it('returns an error if condition is unrecognised', () => {
    condition.run(message, ['mess']);

    expect(send).toBeCalledWith(
      new MessageEmbed({
        description: "Couldn't find a match for condition 'mess'",
      })
    );
  });
});
