import dotenv from 'dotenv'
import Server from './Server'

dotenv.config()
const app = new Server()
app.start()
