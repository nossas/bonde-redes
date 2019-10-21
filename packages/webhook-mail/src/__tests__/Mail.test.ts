import Mail from '../Mail'

describe('Mail testing', () => {
	const opts = {
		from: '"Igor Santos" <igor@nossas.org>',
		to: "target@example.org",
		subject: 'Hello {{name}}',
		body: 'Thank you for contribute with ${{price}}.',
		vars: { name: 'Igor', price: '50' }
	}
	const mail = new Mail(opts)

  test('Mail.body renders with vars', async () => {
    expect(mail.body)
    	.toBe(opts.body.replace('{{price}}', opts.vars.price))
  })

  test('Mail.subject renders with vars', async () => {
  	expect(mail.subject)
  		.toBe(opts.subject.replace('{{name}}', opts.vars.name))
  })

  test('Mail.sender send email', async () => {
  	// TODO: test its ok in staging?
  	const resp = await mail.send()

  	expect(resp.rejected.length).toBe(0)
  	expect(resp.accepted).toEqual(opts.to.split(','))
  })
})