import { createCampaign, saveChannelCampaignLink } from 'bag';
import { fetchCampaign } from 'bag';
import { getCampaignIdForChannel } from 'bag';
import { prefix } from 'config.json';
import { Message, MessageEmbed } from 'discord.js';
import { logger } from 'shared';
import { Command } from 'types';

export default class extends Command {
  constructor() {
    super({
      name: 'bag',
      description: `Keep track of your bag of holding! For more detailed help use ${prefix}bag help`,
      subCommands: true,
    });
  }

  async run(message: Message) {
    const messageEmbed = new MessageEmbed();

    logger.debug('Checking if channel has a campaign');
    const existingCampaign = await getCampaignIdForChannel(message.channel.id);

    if (!existingCampaign) {
      messageEmbed.setDescription(
        `You don't have a bag on this channel. Use "${prefix}bag create campaign name" to make one!`
      );
    } else {
      const campaign = await fetchCampaign(existingCampaign.campaignId);
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
    }

    message.channel.send(messageEmbed);
  }

  async create(message: Message, args: string[]) {
    const messageEmbed = new MessageEmbed();

    if (args.length === 0) {
      messageEmbed.setDescription(
        `❌ You must provide a campaign name, e.g. ${prefix}bag create AWESOME CAMPAIGN`
      );
    } else {
      const campaignName = args.join(' ').trim();

      logger.debug('Checking if channel has a campaign');
      const exisitingCampaign = await getCampaignIdForChannel(
        message.channel.id
      );

      if (exisitingCampaign) {
        messageEmbed.setDescription(
          `You already have a bag on this channel. Use ${prefix}bag to check it's contents.`
        );
      } else {
        logger.debug(`Creating campaign ${campaignName}`);
        const campaign = await createCampaign(campaignName);

        logger.debug(`Saving campaign with ID ${campaign.id}`);
        await saveChannelCampaignLink({
          channelId: message.channel.id,
          campaignId: campaign.id,
        });

        messageEmbed.setDescription('💰 Bag created!');
        messageEmbed.setFooter(`Campaign ID: ${campaign.id}`);
      }
    }
    message.channel.send(messageEmbed);
  }
}
