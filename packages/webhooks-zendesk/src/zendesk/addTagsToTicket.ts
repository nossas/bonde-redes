import Base from './Base'

const addTagsToTicket = (ticket_id: number, tags: string[]) => Base.put(`tickets/${ticket_id}/tags.json`, {
  tags,
})

export default addTagsToTicket
