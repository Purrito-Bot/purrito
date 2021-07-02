import { client } from 'shared';
import {
  FetchCampaign,
  FetchCampaignGQL,
  FetchCampaign_fetchCampaign_Campaign as Campaign,
} from './gql';

export const fetchCampaign = async (id: string): Promise<Campaign> => {
  const { data, errors } = await client.query<FetchCampaign>({
    query: FetchCampaignGQL,
    variables: {
      id,
    },
  });

  if ((errors && errors.length > 0) || !data) {
    throw new Error('Something when wrong while fetching campaign.');
  }

  if (data.fetchCampaign.__typename === 'CampaignNotFound') {
    throw new Error(data.fetchCampaign.message);
  }

  return data.fetchCampaign;
};
