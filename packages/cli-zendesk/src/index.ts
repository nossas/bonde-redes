import { install } from 'source-map-support'
import dotenv from 'dotenv'
import prompts from 'prompts'
import signale from 'signale'
import checkConfig from './checkConfig'
import dbg from './dbg'
import App from './App'

install()
dotenv.config()

const init = async () => {
  try {
    checkConfig()
    const module = await prompts({
      type: 'select',
      name: 'module',
      message: 'Which module you want to execute?',
      choices: [
        { title: 'Ticket', value: 'ticket' },
        { title: 'User', value: 'user' },
      ],
    })

    signale.time('duration')
    switch (module.module) {
      case 'ticket':
        await App.ticket()
        break
      case 'user':
        await App.user()
        break
      default:
        signale.timeEnd('duration')
        signale.success('successfully finished')
    }
  } catch (e) {
    dbg(e)
  }
}

init()
