import dotenv from 'dotenv'
import Server from './Server'
import checkConfig from './checkConfig'
import dbg from './dbg'

dotenv.config()

try {
  checkConfig()
  Server()
} catch (e) {
  dbg(e)
}
