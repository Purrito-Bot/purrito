import { MessageEmbed } from 'discord.js';

export const bagHelp = new MessageEmbed({
  title: 'The Bag of Holding',
  description:
    "A bag of holding isn't the simplest thing to use, but don't worry, I'll help you out.",
  fields: [
    {
      name: '!bag',
      value:
        "Get info about the bag linked to this channel! See !bag link or !bag create if you don't have one.",
    },
    {
      name: '!bag create',
      value:
        'Create a bag for this channel, you just need to name it e.g. !bag create AMAZING BAG',
    },
    {
      name: '!bag item',
      value:
        "What's the point of a bag if you can't put things in there! You can item by using !bag item A SWORD or add an item with a description by adding a comma e.g. !bag item A SWORD, It's truly amazing",
    },
    {
      name: '!bag link',
      value:
        'Have a bag already? Link it to this channel by using !bag link bag-id (psst this will overwrite any existing linked campaign)',
    },
  ],
});
