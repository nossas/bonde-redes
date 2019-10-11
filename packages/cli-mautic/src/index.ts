import dotenv from 'dotenv'
import prompts, { PromptObject } from 'prompts'
import { Signale } from 'signale'
import axios from 'axios'

dotenv.config()

const rMautic = async (url: string, mautic_username: string, mautic_password: string) => {
  const { MAUTIC_API_URL } = process.env
  const token = Buffer.from(`${mautic_username}:${mautic_password}`).toString('base64')
  return axios({
    method: 'get',
    url: MAUTIC_API_URL + url,
    headers: { Authorization: `Basic ${token}` },
  })
}
const signale = new Signale();

(async () => {
  const questions: PromptObject[] = [
    {
      type: 'text',
      name: 'mautic_username',
      message: 'What is your Mautic username?',
    },
    {
      type: 'password',
      name: 'mautic_password',
      message: 'What is your Mautic password?',
    },
  ]

  const response = await prompts(questions)
  const { mautic_username, mautic_password } = response
  const forms = await rMautic('/forms?publishedOnly=1', mautic_username, mautic_password)

  const choices: any[] = []
  forms.data.forms.forEach((el: any) => {
    choices.push({
      title: el.name,
      description: el.description,
      value: el.id,
    })
  })

  // signale.success('Total of forms found:' + forms.data.total);
  // const questions2: PromptObject[] = []

  const response2 = await prompts({
    type: 'select',
    name: 'selectedForm',
    message: 'Escolha um formulário:',
    choices,
    initial: 1,
  })

  signale.success(response2)
  const submissions = await rMautic(`/forms/${response2.selectedForm}/submissions?limit=3`, mautic_username, mautic_password)

  submissions.data.submissions.forEach(async (element: any) => {
    const submitData = {
      'mautic.form_on_submit': [
        {
          submission: element,
          timestamp: new Date().toISOString(),
        },
      ],
    }

    const { REGISTRY_WEBHOOK_URL } = process.env

    try {
      const response3 = await axios({
        method: 'post',
        url: REGISTRY_WEBHOOK_URL,
        data: submitData,
      })
      signale.log(response3.status, response3.statusText)
    } catch (error) {
      signale.error(error)
    }
  })
})()
