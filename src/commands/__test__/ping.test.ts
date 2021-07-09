import Ping from '../ping';

describe('Ping', () => {
  const ping = new Ping();

  const send = jest.fn();
  const edit = jest.fn();
  const message = {
    createdTimestamp: 0,
    channel: {
      id: 'channelId',
      send,
    },
    edit,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with correct values', () => {
    expect(ping.name).toStrictEqual('ping');
    expect(ping.description).toStrictEqual(
      'Calculates latency between discord and bot.'
    );
    expect(ping.permissions).toStrictEqual(['ADMINISTRATOR']);
  });

  it('sends message to channel then edits', async () => {
    send.mockImplementationOnce(() => message);

    await ping.run(message);

    expect(send).toHaveBeenCalledWith('Ping');
    expect(edit).toHaveBeenLastCalledWith('Pong! Latency is 0ms.');
  });
});
