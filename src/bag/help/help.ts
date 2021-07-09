import { MessageEmbed } from 'discord.js';
import { prefix } from 'config.json';

export const bagHelp = new MessageEmbed({
  title: 'The Bag of Holding',
  description:
    "A bag of holding isn't the simplest thing to use, but don't worry, I'll help you out.",
  fields: [
    {
      name: `${prefix}bag`,
      value: `Get info about the bag linked to this channel! See ${prefix}bag link or ${prefix}bag create if \
      you don't have one.`,
    },
    {
      name: `${prefix}bag create`,
      value: `Create a bag for this channel, you just need to name it e.g. ${prefix}bag create AMAZING BAG`,
    },
    {
      name: `${prefix}bag item`,
      value: `What's the point of a bag if you can't put things in there! You can item by using ${prefix}bag \ 
      item A SWORD or add an item with a description by adding a comma e.g. ${prefix}bag item A SWORD, It's \
      truly amazing`,
    },
    {
      name: `${prefix}bag link`,
      value: `Have a bag already? Link it to this channel by using ${prefix}bag link bag-id (psst this will \
        overwrite any existing linked campaign)`,
    },
  ],
});
