
const prodPlugins = []
if (process.env.MODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    //上线打开，开发时禁用
    //'transform-remove-console',
    //发布产品时候的插件数组
    ...prodPlugins,
  ]
}
