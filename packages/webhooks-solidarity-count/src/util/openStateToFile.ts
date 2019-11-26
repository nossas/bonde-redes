import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import dbg from './dbg'

const readFile = promisify(fs.readFile)
const log = dbg.extend('openStateFile')

const openStateFile = async <T>(filename: string): Promise<T | null> => {
  try {
    const buffer = await readFile(path.resolve('src/__tests__/data', `${filename}.json`))
    const state = buffer.toString()
    return JSON.parse(state)
  } catch (e) {
    log(e)
    return null
  }
}

export default openStateFile
