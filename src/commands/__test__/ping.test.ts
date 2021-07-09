import Ping from '../ping';
import MockDiscord from './testData';

describe('Ping', () => {
  const ping = new Ping();
  const discord = new MockDiscord();
  const send = jest.fn();
  const edit = jest.fn();
  discord.getTextChannel().send = send;
  discord.getMessage().edit = edit;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    discord.getClient().destroy();
  });

  it('initialises with correct values', () => {
    expect(ping.name).toStrictEqual('ping');
    expect(ping.description).toStrictEqual(
      'Calculates latency between discord and bot.'
    );
    expect(ping.permissions).toStrictEqual(['ADMINISTRATOR']);
  });

  it('sends message to channel then edits', async () => {
    send.mockImplementationOnce(() => discord.getMessage());

    await ping.run(discord.getMessage());

    expect(send).toHaveBeenCalledWith('Ping');
    expect(edit).toHaveBeenLastCalledWith('Pong! Latency is 0ms.');
  });
});
