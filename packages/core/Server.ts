import Express from 'express'

const App = Express()

App
  .use(Express.json())
  .post('/', (req, res) => {
    console.log(req.body)
  })
  .listen(8081, () => {
    console.log('Servidor escutando na porta 8081...')
  })

export default App
