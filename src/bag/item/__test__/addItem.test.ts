import { AddItemInput } from '../../../../__generated__/globalTypes';
import { client } from '../../../shared/gqlClient';
import { addItem } from '../addItem';
import { AddItemGQL } from '../gql/addItemMutation';

const id = 'test-id';

const input: AddItemInput = {
  name: 'test-item',
};

const setUpQueryMock = ({
  errors = [],
  addItem = {
    __typename: 'Campaign',
    id,
  },
}: {
  errors?: Error[];
  addItem?: any;
}) => {
  return jest.spyOn(client, 'mutate').mockResolvedValueOnce({
    data: {
      addItem,
    },
    errors,
  } as any);
};

const expectedQuery = (id: string, input: AddItemInput) => ({
  mutation: AddItemGQL,
  variables: {
    id,
    input,
  },
});

describe('createCampaign', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('executes a GQL query', async () => {
    const clientSpy = setUpQueryMock({});

    await addItem(id, input);

    expect(clientSpy).toHaveBeenCalledWith(expectedQuery(id, input));
  });

  it('returns the found campaign details', async () => {
    setUpQueryMock({});

    const result = await addItem(id, input);

    expect(result).toStrictEqual({
      __typename: 'Campaign',
      id: 'test-id',
    });
  });

  it('throws an error if creation fails', async () => {
    setUpQueryMock({ errors: [new Error('Something went wrong')] });

    try {
      await addItem(id, input);
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        'Something when wrong while fetching campaign.'
      );
    }
  });

  it('throws an error if campaign not found', async () => {
    setUpQueryMock({
      addItem: {
        __typename: 'CampaignNotFound',
        message: 'campaign not found',
      },
    });

    try {
      await addItem(id, input);
    } catch (error) {
      expect((error as Error).message).toStrictEqual('campaign not found');
    }
  });
});
