import { client } from 'shared/gqlClient';
import { AddItemInput } from '../../../__generated__/globalTypes';
import {
  AddItem,
  AddItemGQL,
  AddItem_addItem_Campaign as Campaign,
} from './gql';

export const addItem = async (
  id: string,
  input: AddItemInput
): Promise<Campaign> => {
  const { data, errors } = await client.mutate<AddItem>({
    mutation: AddItemGQL,
    variables: {
      id,
      input,
    },
  });

  if ((errors && errors.length > 0) || !data) {
    throw new Error('Something when wrong while fetching campaign.');
  }

  if (data.addItem.__typename === 'CampaignNotFound') {
    throw new Error(data.addItem.message);
  }

  return data.addItem;
};
