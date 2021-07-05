import {
  getCampaignIdForChannel,
  saveChannelCampaignLink,
  updateChannelCampaignLink,
} from '../channelCampaignLink';
import { ChannelCampaignLinkModel } from '../model';

const setUpSaveMock = () => {
  return jest
    .spyOn(ChannelCampaignLinkModel.prototype, 'save')
    .mockReturnValueOnce({ channelId: 'channelId', campaignId: 'campaignId' });
};

const setUpFindOneMock = () => {
  return jest.spyOn(ChannelCampaignLinkModel, 'findOne').mockReturnValueOnce({
    channelId: 'channelId',
    campaignId: 'campaignId',
  } as any);
};

const setUpUpdateMock = () => {
  return jest
    .spyOn(ChannelCampaignLinkModel, 'findOneAndUpdate')
    .mockReturnValueOnce({
      channelId: 'channelId',
      campaignId: 'campaignId',
    } as any);
};

describe('channelCampaignLink', () => {
  describe('saveChannelCampaignLink', () => {
    it('saves the channel campaign link to db', async () => {
      const input = { channelId: 'channelId', campaignId: 'campaignId' };

      const mongoMock = setUpSaveMock();

      await saveChannelCampaignLink(input);

      expect(mongoMock).toHaveBeenCalled();
    });

    it('returns the campaign after saving', async () => {
      const input = { channelId: 'channelId', campaignId: 'campaignId' };

      setUpSaveMock();

      const result = await saveChannelCampaignLink(input);

      expect(result.channelId).toStrictEqual(input.channelId);
      expect(result.campaignId).toStrictEqual(input.campaignId);
    });
  });

  describe('getCampaignIdForChannel', () => {
    it('searches the database for the channel ID', async () => {
      const findMock = setUpFindOneMock();

      await getCampaignIdForChannel('channelId');

      expect(findMock).toHaveBeenCalledWith({ channelId: 'channelId' });
    });
  });

  describe('updateChannelCampaignLink', () => {
    it('updates the channel campaign link', async () => {
      const updateLink = setUpUpdateMock();

      await updateChannelCampaignLink({
        campaignId: 'campaignId',
        channelId: 'channelId',
      });

      expect(updateLink).toHaveBeenCalledWith(
        { channelId: 'channelId' },
        { channelId: 'channelId', campaignId: 'campaignId' },
        { useFindAndModify: false, upsert: true, new: true }
      );
    });
  });
});
