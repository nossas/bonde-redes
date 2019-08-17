import Server from './Server'
import dotenv from 'dotenv'
dotenv.config()
const app = new Server()
app.start()
