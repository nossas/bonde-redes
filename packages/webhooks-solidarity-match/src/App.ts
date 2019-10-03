import dbg from "./dbg"
import {Response} from 'express'

const App = (res: Response) => {
  dbg('App executou!')
  res.status(200).json('Ok!')
}

export default App
