
export const encodeText = input => encodeURIComponent(input)

export const whatsappText = ({ volunteer_name, individual_name, agent, isVolunteer, volunteer_email = '' }) => {
  if (isVolunteer) return `${volunteer_name}, aqui é a ${agent} da Rede de Apoio Psicológico. Vim te avisar que sua conexão foi feita! Seu e-mail acaba de ser enviado para ${individual_name}, profissional da saúde que está precisando de atendimento e vai entrar em contato com você. Procurem um horário de atendimento que funcione para ambos e não se esqueça que o atendimento deve ser gratuito e virtual :) \n\nPara te auxiliar, você pode conferir as Diretrizes de Atendimento que enviamos pro seu e-mail no momento do seu cadastro. E mais uma vez obrigada! É muito bom saber que podemos contar com você <3 
  `
  return `${individual_name}, aqui é a ${agent} da Rede de Apoio Psicológico. Vim te avisar que sua conexão com um(a) psicólogo(a) foi feita! Você pode entrar em contato com ${volunteer_name} pelo e-mail ${volunteer_email}. Se apresente e diga que quer marcar um horário para o atendimento. Juntos, vocês podem achar o melhor dia e hora para ambos :) \n\nSe por acaso seus horários forem incompatíveis, fale com a gente por este email para fazermos uma nova conexão: contato@rededeapoiopsicologico.org.br. \n\nEstamos juntos! Toda nossa admiração e agradecimento pelo seu trabalho <3 
  `
}

export const parseNumber = input => input.replace(/\D/g, '')

export const emailValidation = () => (
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
)
