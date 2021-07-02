import { Document, model, Schema } from 'mongoose';

export interface ChannelCampaignLink extends Document {
  channelId: string;
  campaignId: string;
}

const ChannelCampaignLinkSchema = new Schema<ChannelCampaignLink>({
  channelId: { type: String, required: true },
  campaignId: { type: String, required: true },
});

export const ChannelCampaignLinkModel = model<ChannelCampaignLink>(
  'ChannelCampaignLink',
  ChannelCampaignLinkSchema
);
