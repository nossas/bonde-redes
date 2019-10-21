import { install } from 'source-map-support'
import dotenv from 'dotenv'
import Server from './Server'

install()

dotenv.config()
const app = new Server()
app.start()
