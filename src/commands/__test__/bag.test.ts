import config from '../../config.json';
import Bag from '../bag';
import MockDiscord from './testData';
import * as GQLMock from '../../bag/create/createCampaign';
import * as FetchMock from '../../bag/fetch/fetchCampaign';
import * as MongoMock from '../../bag/shared/channelCampaignLink';
import { MessageEmbed } from 'discord.js';
import { FetchCampaign_fetchCampaign_Campaign as Campaign } from 'bag/fetch/gql';

const setUpMocks = ({
  getCampaignMockResult = null,
  fetchCampaignMockResult = null,
}: {
  getCampaignMockResult?: any;
  fetchCampaignMockResult?: any;
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

  const getCampaignMock = jest
    .spyOn(MongoMock, 'getCampaignIdForChannel')
    .mockResolvedValueOnce(getCampaignMockResult);

  const fetchMock = jest
    .spyOn(FetchMock, 'fetchCampaign')
    .mockResolvedValueOnce(fetchCampaignMockResult);

  return { createCampaignMock, saveMock, getCampaignMock, fetchMock };
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

  it('initialises with the correct values', () => {
    expect(bag.name).toStrictEqual('bag');
    expect(bag.description).toStrictEqual(
      `Keep track of your bag of holding! For more detailed help use !bag help`
    );
    expect(bag.subCommands).toStrictEqual(true);
  });

  describe('create', () => {
    it('checks if the channel already has an exisiting bag', async () => {
      const { getCampaignMock } = setUpMocks({});

      await bag.create(discord.getMessage(), ['Campaign Name']);

      expect(getCampaignMock).toHaveBeenCalledWith(discord.getChannel().id);
    });

    it('does not create a campaign if one exists for that channel', async () => {
      const { saveMock, createCampaignMock } = setUpMocks({
        getCampaignMockResult: {
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
        getCampaignMockResult: {
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

      await bag.create(discord.getMessage(), ['Campaign Name']);

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

  describe('fetch', () => {
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

    it('looks for a campaign for the given channel', async () => {
      const { getCampaignMock } = setUpMocks({
        getCampaignMockResult: {
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
        getCampaignMockResult: {
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
            "You already have a bag on this channel. Use !bag to check it's contents.",
        })
      );
    });

    it('fetches the bag if it exists', async () => {
      setUpMocks({
        getCampaignMockResult: {
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
});
