import sourceMapSupport from 'source-map-support'
import dotenv from 'dotenv'
import Server from './Server'
import checkConfig from './checkConfig'
import dbg from './dbg'

sourceMapSupport.install()
dotenv.config()

try {
  checkConfig()
  Server()
} catch (e) {
  dbg(e)
}
