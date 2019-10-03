import Express from 'express'
import dbg from './dbg'
import App from './App'

const log = dbg.extend('router')

const JSONErrorHandler = (err: Error, _: Express.Request, res: Express.Response, __: Express.NextFunction) => {
  if (err instanceof SyntaxError) {
    log(err)
    res.status(400).json('Falha de sintaxe, objeto JSON inválido!')
  }
}

const Router = () => {
  return Express()
    .use(Express.json())
    .use(JSONErrorHandler)
    .post('/', async (req, res) => {
      try {
        App(req.body, res)
      } catch (e) {
        log (e)
        return res.status(400).json('Corpo inválido da requisição')
      }
    })
}

export default Router
