import HasuraBase from './HasuraBase'
import isError, { HasuraResponse } from './isError'
import dbg from './dbg'

const log = dbg.extend('getFormEntries')

const query = `query($advogadaId: Int!, $psicologaId: Int!) {
  form_entries(where: {widget_id: {_in: [$advogadaId, $psicologaId]}}) {
    fields
    created_at
    widget_id
  }
}`

interface Response {
  fields: any
  created_at: string
  widget_id: number
}

const getFormEntries = async () => {
  try {
    const widget_ids: {
      advogadaId: number
      psicologaId: number
    } = JSON.parse(process.env.WIDGET_IDS)
    const { advogadaId, psicologaId } = widget_ids
    const response = await HasuraBase<HasuraResponse<'form_entries', Response[]>>(query, {
      advogadaId,
      psicologaId,
    })

    if (isError(response.data)) {
      return response.data.errors
    }

    return response.data.data.form_entries
  } catch (e) {
    return log(e)
  }
}

export default getFormEntries
