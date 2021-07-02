import { saveChannelCampaignLink } from '../channelCampaignLink';
import { ChannelCampaignLinkModel } from '../model';

const setUpMongoMock = () => {
  return jest
    .spyOn(ChannelCampaignLinkModel.prototype, 'save')
    .mockReturnValueOnce({ channelId: 'channelId', campaignId: 'campaignId' });
};

describe('channelCampaignLink', () => {
  describe('saveChannelCampaignLink', () => {
    it('saves the channel campaign link to db', async () => {
      const input = { channelId: 'channelId', campaignId: 'campaignId' };

      const mongoMock = setUpMongoMock();

      await saveChannelCampaignLink(input);

      expect(mongoMock).toHaveBeenCalled();
    });

    it('returns the campaign after saving', async () => {
      const input = { channelId: 'channelId', campaignId: 'campaignId' };

      setUpMongoMock();

      const result = await saveChannelCampaignLink(input);

      expect(result.channelId).toStrictEqual(input.channelId);
      expect(result.campaignId).toStrictEqual(input.campaignId);
    });
  });
});
