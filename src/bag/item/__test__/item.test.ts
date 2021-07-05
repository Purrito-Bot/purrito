import { parseItem } from '../item';

describe('item', () => {
  it('successfully parses the item name and description', () => {
    const input = ['Amazing', 'Sword,', 'Description', 'is', 'here'];

    const output = parseItem(input);

    expect(output).toStrictEqual({
      name: 'Amazing Sword',
      description: 'Description is here',
    });
  });

  it('successfully parses the item name', () => {
    const input = ['Amazing', 'Sword'];

    const output = parseItem(input);

    expect(output).toStrictEqual({
      name: 'Amazing Sword',
      description: undefined,
    });
  });
});
