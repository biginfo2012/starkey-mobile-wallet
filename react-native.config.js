module.exports = {
  project: {
    ios: {
      unstable_reactLegacyComponentNames: ['RNCMaskedView'],
    },
    android: {
      unstable_reactLegacyComponentNames: [
        'BVLinearGradient',
        'RNCMaskedView',
        'CKCameraManager',
      ],
    },
  },
  assets: ['./src/theme/assets/fonts/'],
};
