import { client } from '../../../shared/gqlClient';
import { fetchCampaign } from '../fetchCampaign';
import { FetchCampaignGQL } from '../gql/fetchCampaignQuery';

const setUpQueryMock = ({
  errors = [],
  fetchCampaign = {
    __typename: 'Campaign',
    id: 'test-id',
    gold: 0,
    silver: 0,
    bronze: 0,
    items: [],
  },
}: {
  errors?: Error[];
  fetchCampaign?: any;
}) => {
  return jest.spyOn(client, 'query').mockResolvedValueOnce({
    data: {
      fetchCampaign,
    },
    errors,
  } as any);
};

const expectedQuery = (id: string) => ({
  query: FetchCampaignGQL,
  variables: {
    id,
  },
});

describe('createCampaign', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('executes a GQL query', async () => {
    const id = 'test-id';

    const clientSpy = setUpQueryMock({});

    await fetchCampaign(id);

    expect(clientSpy).toHaveBeenCalledWith(expectedQuery(id));
  });

  it('returns the found campaign details', async () => {
    const id = 'test-id';

    setUpQueryMock({});

    const result = await fetchCampaign(id);

    expect(result).toStrictEqual({
      __typename: 'Campaign',
      id: 'test-id',
      gold: 0,
      silver: 0,
      bronze: 0,
      items: [],
    });
  });

  it('throws an error if creation fails', async () => {
    const id = 'test-id';

    setUpQueryMock({ errors: [new Error('Something went wrong')] });

    try {
      await fetchCampaign(id);
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        'Something when wrong while fetching campaign.'
      );
    }
  });

  it('throws an error if campaign not found', async () => {
    const id = 'test-id';

    setUpQueryMock({
      fetchCampaign: {
        __typename: 'CampaignNotFound',
        message: 'campaign not found',
      },
    });

    try {
      await fetchCampaign(id);
    } catch (error) {
      expect((error as Error).message).toStrictEqual('campaign not found');
    }
  });
});
