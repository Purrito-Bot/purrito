import { createCampaign, saveChannelCampaignLink } from 'bag';
import { prefix } from 'config.json';
import { Message, MessageEmbed } from 'discord.js';
import { logger } from 'shared';
import { Command } from 'types';

export default class extends Command {
  constructor() {
    super({
      name: 'bag',
      description: `Keep track of your bag of holding! For more detailed help use ${prefix}bag help`,
      developerCommand: true,
      subCommands: true,
    });
  }

  async run(message: Message) {
    message.channel.send('Under construction');
  }

  async create(message: Message, args: string[]) {
    const messageEmbed = new MessageEmbed();

    if (args.length === 0) {
      messageEmbed.setDescription(
        `❌ You must provide a campaign name, e.g. ${prefix}bag create AWESOME CAMPAIGN`
      );
    } else {
      const campaignName = args.join(' ').trim();

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
    message.channel.send(messageEmbed);
  }
}
