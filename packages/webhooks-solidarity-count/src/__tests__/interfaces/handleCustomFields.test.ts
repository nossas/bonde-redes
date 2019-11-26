import openStateFile from '../../util/openStateToFile'
import handleCustomFields from '../../interfaces/Ticket/handleCustomFields'
import { TicketZendesk } from '../../interfaces/Ticket'

describe('handleUserFields tests', () => {
  test('it correctly converts user fields keeping object properties', async (done) => {
    const ticketWithoutCustomFields = await openStateFile<TicketZendesk>('ticketWithoutCustomFields')
    expect(ticketWithoutCustomFields).toBeTruthy()

    const ticketWithCustomFields = await openStateFile<TicketZendesk>('ticketWithCustomFields')
    expect(ticketWithCustomFields).toBeTruthy()

    const result = handleCustomFields(ticketWithoutCustomFields!)
    expect(result).toEqual(ticketWithCustomFields)

    done()
  })
})
