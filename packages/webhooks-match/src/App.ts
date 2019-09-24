import Express from 'express'

const App = () => {
  return Express()
    .use(Express.json())
    .post('/', (req, res) => {
      res.status(200).json('Ok!')
    })
}

export default App
