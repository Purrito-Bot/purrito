import { AddItemInput } from '../../../__generated__/globalTypes';

export const parseItem = (args: string[]): AddItemInput => {
  const [name, description] = args.join(' ').split(',');

  return { name: name.trim(), description: description.trim() };
};
