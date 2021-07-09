import { FetchCampaign_fetchCampaign_Campaign as Campaign } from 'bag/fetch/gql';
import { MessageEmbed } from 'discord.js';
import * as GQLMock from '../../bag/create/createCampaign';
import * as FetchMock from '../../bag/fetch/fetchCampaign';
import { bagHelp } from '../../bag/help/help';
import * as AddItemMock from '../../bag/item/addItem';
import * as MongoMock from '../../bag/shared/channelCampaignLink';
import config from '../../config.json';
import Bag from '../bag';
import MockDiscord from './testData';

const setUpMocks = ({
  getCampaignForChannelMockResult = null,
  fetchCampaignMockResult = null,
  addItemMockResult = null,
}: {
  getCampaignForChannelMockResult?: any;
  fetchCampaignMockResult?: any;
  addItemMockResult?: any;
}) => {
  const createCampaignMock = jest
    .spyOn(GQLMock, 'createCampaign')
    .mockResolvedValueOnce({
      __typename: 'CreatedCampaign',
      id: 'campaignId',
    });

  const saveMock = jest
    .spyOn(MongoMock, 'saveChannelCampaignLink')
    .mockResolvedValueOnce({
      channelId: 'channelId',
      campaignId: 'campaignId',
    } as any);

  const updateMock = jest
    .spyOn(MongoMock, 'updateChannelCampaignLink')
    .mockResolvedValueOnce({
      channelId: 'channelId',
      campaignId: 'campaignId',
    } as any);

  const getCampaignMock = jest
    .spyOn(MongoMock, 'getCampaignIdForChannel')
    .mockResolvedValueOnce(getCampaignForChannelMockResult);

  const fetchMock = jest
    .spyOn(FetchMock, 'fetchCampaign')
    .mockResolvedValueOnce(fetchCampaignMockResult);

  const addItemMock = jest
    .spyOn(AddItemMock, 'addItem')
    .mockResolvedValueOnce(addItemMockResult);

  return {
    createCampaignMock,
    saveMock,
    getCampaignMock,
    fetchMock,
    addItemMock,
    updateMock,
  };
};

const fetchCampaignMockResult: Campaign = {
  __typename: 'Campaign',
  id: 'campaignId',
  name: 'test',
  gold: 0,
  silver: 0,
  bronze: 0,
  items: [
    {
      __typename: 'Item',
      name: 'Item name',
      description: 'Item description',
    },
  ],
};

describe('bag', () => {
  config.prefix = '!';

  const bag = new Bag();
  const discord = new MockDiscord();
  const send = jest.fn();
  discord.getTextChannel().send = send;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    discord.getClient().destroy();
  });

  it('initialises with the correct values', () => {
    expect(bag.name).toStrictEqual('bag');
    expect(bag.description).toStrictEqual(
      `Keep track of your bag of holding! For more detailed help use !bag help`
    );
    expect(bag.subCommands).toStrictEqual(true);
  });

  describe('create', () => {
    it('checks if the channel already has an existing bag', async () => {
      const { getCampaignMock } = setUpMocks({});

      await bag.create(discord.getMessage(), ['Campaign Name']);

      expect(getCampaignMock).toHaveBeenCalledWith(discord.getChannel().id);
    });

    it('does not create a campaign if one exists for that channel', async () => {
      const { saveMock, createCampaignMock } = setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
      });

      await bag.create(discord.getMessage(), ['Campaign Name']);

      expect(saveMock).not.toHaveBeenCalled();
      expect(createCampaignMock).not.toHaveBeenCalled();
    });

    it('informs the user when they already have a bag', async () => {
      setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
      });

      await bag.create(discord.getMessage(), ['Campaign Name']);

      expect(send).toHaveBeenLastCalledWith(
        new MessageEmbed({
          description:
            "You already have a bag on this channel. Use !bag to check it's contents.",
        })
      );
    });

    it('creates a bag and saves the id against the channel id', async () => {
      const { createCampaignMock, saveMock } = setUpMocks({});

      await bag.create(discord.getMessage(), ['Campaign', 'Name']);

      expect(saveMock).toHaveBeenCalledWith({
        channelId: discord.getChannel().id,
        campaignId: 'campaignId',
      });

      expect(createCampaignMock).toHaveBeenCalledWith('Campaign Name');
    });

    it('messages the user the campaign has been saved', async () => {
      setUpMocks({});

      await bag.create(discord.getMessage(), ['Campaign Name']);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description: '💰 Bag created!',
          footer: { text: 'Campaign ID: campaignId' },
        })
      );
    });

    it('wants the user when they have not provided a name', async () => {
      setUpMocks({});

      await bag.create(discord.getMessage(), []);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description:
            '❌ You must provide a campaign name, e.g. !bag create AWESOME CAMPAIGN',
        })
      );
    });
  });

  describe('help', () => {
    it('returns a helpful message', async () => {
      bag.help(discord.getMessage());

      expect(send).toHaveBeenCalledWith(bagHelp);
    });
  });

  describe('fetch', () => {
    it('looks for a campaign for the given channel', async () => {
      const { getCampaignMock } = setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
        fetchCampaignMockResult,
      });

      await bag.run(discord.getMessage());

      expect(getCampaignMock).toHaveBeenCalledWith(discord.getChannel().id);
    });

    it('fetches the bag if it exists', async () => {
      const { fetchMock } = setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
        fetchCampaignMockResult,
      });

      await bag.run(discord.getMessage());

      expect(fetchMock).toHaveBeenCalledWith('campaignId');
    });

    it('informs the user if they do not have a campaign', async () => {
      setUpMocks({});

      await bag.run(discord.getMessage());

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description:
            'You don\'t have a bag on this channel. Use "!bag create campaign name" to make one!',
        })
      );
    });

    it('fetches the bag if it exists', async () => {
      setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
        fetchCampaignMockResult,
      });

      await bag.run(discord.getMessage());

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description: 'Gold: 0\nSilver: 0\nCopper: 0',
          title: 'test',
          fields: [{ name: 'Item name', value: 'Item description' }],
          footer: { text: 'Campaign ID: campaignId' },
        })
      );
    });
  });

  describe('add item', () => {
    it('checks if the channel already has an existing bag', async () => {
      const { getCampaignMock } = setUpMocks({});

      await bag.item(discord.getMessage(), ['My', 'Item']);

      expect(getCampaignMock).toHaveBeenCalledWith(discord.getChannel().id);
    });

    it("informs the user when they don't have a bag", async () => {
      setUpMocks({});

      await bag.item(discord.getMessage(), ['My', 'Item']);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description:
            'You don\'t have a bag on this channel. Use "!bag create campaign name" to make one!',
        })
      );
    });

    it('creates an item when one is provided', async () => {
      const { addItemMock } = setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
        addItemMockResult: {
          id: 'campaignId',
        },
      });

      await bag.item(discord.getMessage(), ['My', 'Item,', 'Description']);

      expect(addItemMock).toHaveBeenCalledWith('campaignId', {
        name: 'My Item',
        description: 'Description',
      });
    });

    it('warns the user when no item name was provided', async () => {
      setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
      });

      await bag.item(discord.getMessage(), []);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description:
            '❌ You must provide an item name, e.g. !bag item AMAZING BOOK',
        })
      );
    });

    it('informs the user when an item is created', async () => {
      setUpMocks({
        getCampaignForChannelMockResult: {
          channelId: 'channelId',
          campaignId: 'campaignId',
        },
        addItemMockResult: {
          id: 'campaignId',
        },
      });

      await bag.item(discord.getMessage(), ['My', 'Item,', 'Description']);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description: '💰 Item added!',
          footer: {
            text: 'Campaign ID: campaignId',
          },
        })
      );
    });
  });

  describe('link', () => {
    it('checks the user provided campaign exists', async () => {
      const { fetchMock } = setUpMocks({
        fetchCampaignMockResult,
      });

      await bag.link(discord.getMessage(), ['campaignId']);

      expect(fetchMock).toHaveBeenCalledWith('campaignId');
    });

    it('sends an error when the campaign does not exist', async () => {
      jest
        .spyOn(FetchMock, 'fetchCampaign')
        .mockRejectedValueOnce({ message: 'Fail' });

      await bag.link(discord.getMessage(), ['campaignId']);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({ description: 'Fail' })
      );
    });

    it('warns the user when a campaign id is not provided', async () => {
      const { fetchMock } = setUpMocks({
        fetchCampaignMockResult,
      });

      await bag.link(discord.getMessage(), []);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description:
            '❌ Please provide the ID of the campaign you want to link this channel to, e.g. !bag link 12345.',
        })
      );

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('links the campaign id to the channel id', async () => {
      const { updateMock } = setUpMocks({
        fetchCampaignMockResult,
      });

      await bag.link(discord.getMessage(), ['campaignId']);

      expect(updateMock).toHaveBeenCalledWith({
        channelId: discord.getChannel().id,
        campaignId: 'campaignId',
      });
    });

    it('tells the user when the link is successful', async () => {
      setUpMocks({
        fetchCampaignMockResult,
      });

      await bag.link(discord.getMessage(), ['campaignId']);

      expect(send).toHaveBeenCalledWith(
        new MessageEmbed({
          description: '💰 Bag linked!',
          footer: { text: 'Campaign ID: campaignId' },
        })
      );
    });
  });
});
