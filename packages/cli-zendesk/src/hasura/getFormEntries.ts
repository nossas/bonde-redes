import axios from 'axios'
import * as yup from 'yup'
import dbg from './dbg'

const log = dbg.extend('BondeCreatedDate')

const query = `query($advogadaId: Int!, $psicologaId: Int!, $volunteerId: Int!) {
  form_entries(where: {widget_id: {_in: [$advogadaId, $psicologaId, $volunteerId]}}) {
    fields
    created_at
    widget_id
  }
}`

interface FormEntry {
  fields: string
  created_at: string
  widget_id: number
}

type DataType = {
  data: {
    form_entries: FormEntry[]
  }
} & {errors: any}

const getFormEntries = async () => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET, WIDGET_IDS } = process.env
  const widget_ids = JSON.parse(WIDGET_IDS)
  if (!yup.object().shape({
    ADVOGADA: yup.number().required(),
    PSICÓLOGA: yup.number().required(),
    MSR: yup.number().required(),
  }).isValid(widget_ids)) {
    throw new Error('Invalid WIDGET_IDS env var')
  }
  const data = await axios.post<DataType>(HASURA_API_URL!, {
    query,
    variables: {
      advogadaId: widget_ids.ADVOGADA,
      psicologaId: widget_ids.PSICÓLOGA,
      volunteerId: widget_ids.MSR,
    },
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET,
    },
  })

  if (data.data.errors) {
    throw data.data.errors
  }

  return data.data.data.form_entries
}

export const filterByEmail = (formEntries: FormEntry[], email) => {
  const filteredFormEntries = formEntries.filter((i) => {
    try {
      const parsedFields = JSON.parse(i.fields)

      if (i.widget_id === 17633 || i.widget_id === 17628) {
        return parsedFields[2].value === email
      }

      return parsedFields[1].value === email
    } catch (e) {
      return false
    }
  })

  if (filteredFormEntries.length === 0) {
    log(`Sem data do bonde para o email ${email}.`)
    return null
  }

  return filteredFormEntries.sort((a, b) => (
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ))[0].created_at
}

export default getFormEntries
