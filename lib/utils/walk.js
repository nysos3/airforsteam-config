const path = require('path')
const fs = require('fs-extra')

function walkSync (dir, fileList) {
  const files = fs.readdirSync(dir)
  fileList = fileList || []
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = walkSync(path.join(dir, file), fileList)
    } else {
      fileList.push(path.join(dir, file))
    }
  })
  return fileList
}
module.exports = walkSync
