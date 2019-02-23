const chalk = require('chalk')

function debug () {
  console.log(chalk.green('[airforsteam] debug'))
  console.log.apply(console, arguments)
  console.log(chalk.green('=============================='))
}

module.exports = debug
