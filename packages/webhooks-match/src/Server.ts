import App from './App'
import dbg from './dbg'

const Server = () => {
  const {PORT} = process.env
  return App().listen(PORT, () => {
    dbg(`Server listen on PORT ${PORT}`)
  })
}

export default Server
