import {
  addItem,
  createCampaign,
  fetchCampaign,
  getCampaignIdForChannel,
  parseItem,
  saveChannelCampaignLink,
  updateChannelCampaignLink,
} from 'bag';
import { FetchCampaign_fetchCampaign_Campaign as Campaign } from 'bag/fetch/gql';
import { ChannelCampaignLink } from 'bag/shared/model';
import { prefix } from 'config.json';
import { Message, MessageEmbed } from 'discord.js';
import { logger } from 'shared';
import { Command } from 'types';

const checkForCampaign = async (id: string) => {
  logger.debug('Checking if channel has a campaign');
  const existingCampaign = await getCampaignIdForChannel(id);

  if (!existingCampaign) {
    throw new Error(
      `You don't have a bag on this channel. Use "${prefix}bag create campaign name" to make one!`
    );
  }

  return existingCampaign;
};

const checkNoCampaignExists = async (id: string) => {
  logger.debug('Checking if channel has a campaign');
  const existingCampaign = await getCampaignIdForChannel(id);

  if (existingCampaign) {
    throw new Error(
      `You already have a bag on this channel. Use ${prefix}bag to check it's contents.`
    );
  }
};

const campaignToMessageEmbed = (campaign: Campaign) => {
  const messageEmbed = new MessageEmbed();
  messageEmbed.setTitle(campaign.name);
  messageEmbed.setDescription(
    `Gold: ${campaign.gold}\nSilver: ${campaign.silver}\nCopper: ${campaign.bronze}`
  );
  messageEmbed.setFooter(`Campaign ID: ${campaign.id}`);
  messageEmbed.addFields(
    campaign.items.map((item) => ({
      name: item.name,
      value: item.description,
    }))
  );

  return messageEmbed;
};

const saveCampaign = async (campaignName: string, channelId: string) => {
  logger.debug(`Creating campaign ${campaignName}`);
  const { id: campaignId } = await createCampaign(campaignName);

  logger.debug(`Saving campaign with ID ${campaignId}`);
  await saveChannelCampaignLink({
    channelId,
    campaignId,
  });

  return campaignId;
};

export default class extends Command {
  constructor() {
    super({
      name: 'bag',
      description: `Keep track of your bag of holding! For more detailed help use ${prefix}bag help`,
      subCommands: true,
    });
  }

  async run(message: Message) {
    let existingCampaign: ChannelCampaignLink;

    try {
      existingCampaign = await checkForCampaign(message.channel.id);
    } catch (error) {
      return message.channel.send(
        new MessageEmbed({ description: error.message })
      );
    }

    const campaign = await fetchCampaign(existingCampaign.campaignId);
    return message.channel.send(campaignToMessageEmbed(campaign));
  }

  async create(message: Message, args: string[]) {
    if (args.length === 0) {
      return message.channel.send(
        new MessageEmbed({
          description: `❌ You must provide a campaign name, e.g. ${prefix}bag create AWESOME CAMPAIGN`,
        })
      );
    }

    const campaignName = args.join(' ').trim();

    try {
      await checkNoCampaignExists(message.channel.id);
    } catch (error) {
      return message.channel.send(
        new MessageEmbed({ description: error.message })
      );
    }

    const campaignId = await saveCampaign(campaignName, message.channel.id);

    return message.channel.send(
      new MessageEmbed({
        description: '💰 Bag created!',
        footer: { text: `Campaign ID: ${campaignId}` },
      })
    );
  }

  async item(message: Message, args: string[]) {
    let existingCampaign: ChannelCampaignLink;

    try {
      existingCampaign = await checkForCampaign(message.channel.id);
    } catch (error) {
      return message.channel.send(
        new MessageEmbed({ description: error.message })
      );
    }

    if (args.length === 0) {
      return message.channel.send(
        new MessageEmbed({
          description: `❌ You must provide an item name, e.g. ${prefix}bag item AMAZING BOOK`,
        })
      );
    }
    const item = parseItem(args);

    const { id: campaignId } = await addItem(existingCampaign.campaignId, item);

    return message.channel.send(
      new MessageEmbed({
        description: '💰 Item added!',
        footer: { text: `Campaign ID: ${campaignId}` },
      })
    );
  }

  async link(message: Message, args: string[]) {
    const [id] = args;

    if (!id) {
      return message.channel.send(
        new MessageEmbed({
          description: `❌ Please provide the ID of the campaign you want to link this channel to, e.g. ${prefix}bag link 12345.`,
        })
      );
    }

    let campaignId: string;
    try {
      const campaign = await fetchCampaign(id);
      campaignId = campaign.id;
    } catch (error) {
      return message.channel.send(
        new MessageEmbed({ description: error.message })
      );
    }

    await updateChannelCampaignLink({
      channelId: message.channel.id,
      campaignId,
    });

    return message.channel.send(
      new MessageEmbed({
        description: '💰 Bag linked!',
        footer: { text: `Campaign ID: ${campaignId}` },
      })
    );
  }
}
