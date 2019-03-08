import os from 'os'
import path from 'path'
import { remote } from 'electron'

export default (...app) => {
  const env = (process.env.IS_ELECTRON && remote && remote.process) ? remote.process.env : process.env
  if (os.type() === 'Darwin') {
    return path.join(env.HOME, 'Library', 'Application Support', ...app)
  } else if (os.type() === 'Windows_NT') {
    return path.join(env.APPDATA, ...app)
  } else {
    return path.join(env.HOME, '.config', ...app)
  }
}
