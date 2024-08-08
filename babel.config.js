module.exports = function (api) {
  if (!api.cache.never && !api.cache.forever) {
    api.cache(true);
  }

  const presets = [];
  const plugins = [
    './build_plugins/removeWindow',
  ];

  if (api.env('test')) {
    presets.push('@babel/preset-env');
    plugins.length = 0;
  }

  return {
    presets,
    plugins,
  };
};