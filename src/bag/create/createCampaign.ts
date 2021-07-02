import { client } from 'shared/gqlClient';
import {
  CreateCampaignGQL,
  CreateCampaign_createCampaign as CreatedCampaign,
} from './gql';

export const createCampaign = async (
  name: string
): Promise<CreatedCampaign> => {
  const { data, errors } = await client.query<CreatedCampaign>({
    query: CreateCampaignGQL,
    variables: {
      name,
    },
  });

  if (errors && errors.length > 0) {
    throw new Error('Failed to create campaign.');
  }

  return data;
};
