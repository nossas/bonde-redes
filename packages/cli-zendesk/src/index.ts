import {install} from 'source-map-support'
install()
import dotenv from 'dotenv'
dotenv.config()
import checkConfig from './checkConfig'
import dbg from './dbg'
import prompts from 'prompts'
import App from './App'
import signale from 'signale'

const init = async () => {
  try {
    checkConfig()
    const module = await prompts({
      type: 'select',
      name: 'module',
      message: 'Which module you want to execute?',
      choices: [
        { title: 'Ticket', value: 'ticket' },
        { title: 'User', value: 'user' }
      ]
    })

    signale.time('duration')
    switch(module.module) {
      case 'ticket':
        await App.ticket()
        break
      case 'user':
        await App.user()
        break
    }
    signale.timeEnd('duration')

    signale.success('successfully finished')
  } catch (e) {
    dbg(e)
  }
}

init()

