
const prodPlugins = []
if (process.env.MODE_ENV === 'production') {
  //https://babeljs.io/docs/en/babel-plugin-transform-remove-console
  //安装：npm install babel-plugin-transform-remove-console --save-dev
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
    //发布产品时候的插件数组，上线打开，开发时禁用
    ...prodPlugins,
  ]
}
