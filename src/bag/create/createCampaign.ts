import { client } from '../../shared/gqlClient';
import { CreateCampaignGQL } from './gql/createCampaignMutation';
import { CreateCampaign_createCampaign as CreatedCampaign } from './gql/__generated__/CreateCampaign';

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
