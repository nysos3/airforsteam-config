module.exports = {
  overrides: [{
    test: './lib',
    presets: [
      [
        '@babel/env',
        {
          modules: 'commonjs',
        },
      ],
    ],
    plugins: [
      [
        '@babel/transform-runtime',
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false,
        },
      ],
    ],
  }],
}

// module.exports = {
//   presets: [
//     '@vue/app',
//   ],
//   plugins: [

//   ],
// }
