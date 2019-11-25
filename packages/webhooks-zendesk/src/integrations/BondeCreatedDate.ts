import axios from 'axios'
import * as yup from 'yup'
import debug from 'debug'

const query = `query($advogadaId: Int!, $psicologaId: Int!) {
  form_entries(where: {widget_id: {_in: [$advogadaId, $psicologaId]}}) {
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

interface DataType {
  data: {
    form_entries: FormEntry[]
  }
}

class BondeCreatedDate {
  email: string

  name: string | null

  dbg = debug('webhooks-zendesk-BondeCreatedDate')

  constructor(email: string, name: string | null) {
    this.email = email
    this.name = name
  }

  getFormEntries = async () => {
    const { HASURA_API_URL, X_HASURA_ADMIN_SECRET, WIDGET_IDS } = process.env
    let widget_ids
    try {
      widget_ids = JSON.parse(WIDGET_IDS)
      if (!yup.object().shape({
        ADVOGADA: yup.number().required(),
        PSICÓLOGA: yup.number().required(),
      }).isValid(widget_ids)) {
        throw new Error('Invalid WIDGET_IDS env var')
      }
    } catch (e) {
      return this.dbg(e)
    }
    try {
      const data = await axios.post<DataType>(HASURA_API_URL!, {
        query,
        variables: {
          advogadaId: widget_ids.ADVOGADA,
          psicologaId: widget_ids['PSICÓLOGA'],
        },
      }, {
        headers: {
          'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET,
        },
      })
      return data.data.data.form_entries
    } catch (e) {
      return this.dbg(e)
    }
  }

  filterByEmail = (formEntries: FormEntry[]) => formEntries.filter((i) => {
    try {
      const parsedFields = JSON.parse(i.fields)
      return parsedFields[2].value === this.email
    } catch (e) {
      return false
    }
  })

  start = async () => {
    const formEntries = await this.getFormEntries()
    if (!formEntries) {
      return this.dbg('getFormEntries error')
    }
    const filteredFormEntries = await this.filterByEmail(formEntries)
    if (!filteredFormEntries) {
      return this.dbg('filteredFormEntries error')
    }

    try {
      const parsedFields = JSON.parse(filteredFormEntries[0].fields)
      const aux = {
        created_at: filteredFormEntries[0].created_at,
        name: (typeof this.name !== 'string' || this.name.length === 0) ? `${parsedFields[0].value} ${parsedFields[1].value}` : this.name,
      }
      return aux
    } catch {
      this.dbg(`formEntries not found for email ${this.email}`)
      return {
        created_at: new Date().toString(),
        name: this.name || 'sem nome',
      }
    }
  }
}

export default BondeCreatedDate
