#!/usr/bin/env node

let es6
try {
  // eslint-disable-next-line no-new-func
  es6 = new Function('() => {}')
} catch (e) {
  es6 = false
}
es6 ? require('../lib/cli') : require('../lib-es5/cli')
