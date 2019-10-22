import gql from 'graphql-tag'
import GraphQLAPI from './GraphQLAPI'

export interface DetailPressureOpts {
	id: number
}

export const detailPressure = async (opts: DetailPressureOpts) => {
	const detailQuery = gql`
		query DetailPressure ($id: Int!){
		  activist_pressures(where: { id: { _eq: $id } }) {
		    widget {
		      settings
		    }
		    activist {
		      name
		      email
		    }
		  }
		}
	`

	const result = await GraphQLAPI.query({ query: detailQuery, variables: opts })
	return result.data.activist_pressures[0]
}

export interface MailOpts {
	email_from: string
	email_to: string
	subject: string
	body: string
}

export const sendMail = async (input: any) => {
	try {
		const insertMailMutation = gql`
			mutation SendMail ($input: [notify_mail_insert_input!]!){
			  insert_notify_mail(objects: $input) {
			    returning {
			      email_to
			      email_from
			      created_at
			      delivered_at
			    }
			  }
			}
		`

		return GraphQLAPI.mutate({ mutation: insertMailMutation, variables: { input } })
	} catch (err) {
		console.log(err)
	}
}