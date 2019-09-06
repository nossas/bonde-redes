import axios from 'axios'
import * as yup from 'yup'

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
  constructor(email: string) {
    this.email = email
  }

  getFormEntries = async () => {
    const {HASURA_API_URL, X_HASURA_ADMIN_SECRET, WIDGET_IDS} = process.env
    let widget_ids
    try {
      widget_ids = JSON.parse(WIDGET_IDS)
      if (!yup.object().shape({
        'ADVOGADA': yup.number().required(),
        'PSICÓLOGA': yup.number().required(),
      }).isValid(widget_ids)) {
        throw new Error('Invalid WIDGET_IDS env var')
      }
    } catch(e) {
      return
    }
    const {data: {data: {form_entries}}} = await axios.post<DataType>(HASURA_API_URL!, {
      query,
      variables: {
        advogadaId: widget_ids['ADVOGADA'],
        psicologaId: widget_ids['PSICÓLOGA']
      }
    }, {
      headers: {
        'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
      }
    })
    
    return form_entries
  }

  filterByEmail = (formEntries: FormEntry[]) => {
    try {
      const filteredEntries = formEntries.filter(i => {
        const parsedFields = JSON.parse(i.fields)
        return parsedFields[2].value === this.email
      })
      if (filteredEntries.length > 0) {
        return filteredEntries
      }

      return null
    } catch(e) {
      return null
    }
  }

  start = async () => {
    const formEntries = await this.getFormEntries()
    if (!formEntries) {
      throw new Error('getFormEntries error')
    }
    const filteredFormEntries = await this.filterByEmail(formEntries)
    if (!filteredFormEntries) {
      throw new Error('filteredFormEntries error')
    }

    try {
      return filteredFormEntries[0].created_at
    } catch (e) {
      console.log(e)
      return new Date().toString()
    }
  }
}

export default BondeCreatedDate
