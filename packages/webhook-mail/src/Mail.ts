import nunjucks from 'nunjucks'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.SMTP_HOST) throw new Error('Please specify the `SMTP_HOST` environment variable.')
if (!process.env.SMTP_PORT) throw new Error('Please specify the `SMTP_PORT` environment variable.')
if (!process.env.SMTP_USER) throw new Error('Please specify the `SMTP_USER` environment variable.')
if (!process.env.SMTP_PASS) throw new Error('Please specify the `SMTP_PASS` environment variable.')


export interface MailSettings {
	body: string
	from: string // Ex.: "Foo bar" <foo@example.com>
	to: string // Ex.: bar@example.com, baz@example.com
	subject: string
	vars: any
}

class Mail {

	private engine = nunjucks
	private mailer: any
	private settings: MailSettings

	constructor (settings: MailSettings) {
		this.settings = settings

		// Configure template engine
		this.engine.configure({ autoscape: true })

		// Configure mailer client
		this.mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS // generated ethereal password
      }
    })
	}

	get body () {
		const { body: template, vars } = this.settings
		return this.engine.renderString(template, vars)
	}

	get subject () {
		const { subject: template, vars } = this.settings
		return this.engine.renderString(template, vars)
	}

	send = async () => {
		return await this.mailer.sendMail({
      from: this.settings.from,
      to: this.settings.to,
      subject: this.subject,
      html: this.body
    })
	}
}

export default Mail