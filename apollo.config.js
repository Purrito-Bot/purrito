module.exports = {
  client: {
    service: 'bag-of-holding',
    includes: ['./packages/**/*.{ts,tsx}'],
    excludes: ['**/node_modules', '**/*.test.tsx', '**/__tests__/**'],
    tagName: 'gql',
  },
};
