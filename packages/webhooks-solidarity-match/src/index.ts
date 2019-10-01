import sourceMapSupport from 'source-map-support'
sourceMapSupport.install()
import dotenv from 'dotenv'
dotenv.config()
import Server from './Server'
import checkConfig from './checkConfig'
import dbg from './dbg'

try {
  checkConfig()
  Server()
} catch (e) {
  dbg(e)
}
