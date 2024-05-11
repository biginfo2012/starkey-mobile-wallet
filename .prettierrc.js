module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: false,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: [
    '^react(.*)',
    'antd/(.*)',
    '<THIRD_PARTY_MODULES>',
    '@/(.*)',
    '^[./]',
  ],
  importOrderSeparation: true,
};
