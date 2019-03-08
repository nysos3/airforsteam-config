import os from 'os'
import path from 'path'

export default (...app) => {
  if (os.type() === 'Darwin') {
    return path.join(process.env.HOME, 'Library', 'Application Support', ...app)
  } else if (os.type() === 'Windows_NT') {
    return path.join(process.env.APPDATA, ...app)
  } else {
    return path.join(process.env.HOME, '.config', ...app)
  }
}
