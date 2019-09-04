import axios from 'axios'

const query = `{
  form_entries {
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
    const {HASURA_API_URL, X_HASURA_ADMIN_SECRET} = process.env
    const {data: {data: {form_entries}}} = await axios.post<DataType>(HASURA_API_URL!, {
      query
    }, {
      headers: {
        'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
      }
    })
    
    return form_entries
  }

  filterByWidgetId = (formEntries: FormEntry[]) => {
    const {WIDGET_IDS} = process.env
    try {
      const widgets = JSON.parse(WIDGET_IDS)
      const advogadaId = widgets['ADVOGADA']
      const psicologaId = widgets['PSICÓLOGA']
      return formEntries.filter(i => [Number(advogadaId), Number(psicologaId)].includes(i.widget_id))
    } catch (e) {
      return null
    }
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
    const scopedFormEntries = await this.filterByWidgetId(formEntries)
    if (!scopedFormEntries) {
      throw new Error('filterByWidgetId error')
    }
    const filteredFormEntries = await this.filterByEmail(scopedFormEntries)
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
