import { client } from 'shared/gqlClient';
import {
  CreateCampaign,
  CreateCampaignGQL,
  CreateCampaign_createCampaign as CreatedCampaign,
} from './gql';

export const createCampaign = async (
  name: string
): Promise<CreatedCampaign> => {
  const { data, errors } = await client.mutate<CreateCampaign>({
    mutation: CreateCampaignGQL,
    variables: {
      name,
    },
  });

  if ((errors && errors.length > 0) || !data) {
    throw new Error('Failed to create campaign.');
  }

  return data.createCampaign;
};
