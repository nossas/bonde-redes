export const encodeText = (input: string): string => encodeURIComponent(input);

export const parseNumber = (input: string): string => input.replace(/\D/g, "");

export const whatsappText = ({
  volunteer_name,
  individual_name,
  agent,
  isVolunteer,
  volunteer_email = ""
}): string => {
  if (isVolunteer)
    return `${volunteer_name}, aqui é a equipe da Rede de Apoio Psicológico. Viemos te avisar que sua conexão foi feita! Seu endereço de e-mail acaba de ser enviado para ${individual_name}, profissional da saúde que está precisando de apoio e vai entrar em contato com você. Procurem um horário que funcione para ambos e não se esqueça de que o atendimento deve ser gratuito e virtual. Para te auxiliar, você pode conferir as "Diretrizes de Atendimento" que enviamos para o seu e-mail no momento do seu cadastro.\n\n
  Além disso, disponibilizamos uma rede de dispositivos de apoio para os psicólogos composta de grupos, supervisões e discussões sobre o escopo do projeto, todos gratuitos e seguindo as normas de sigilo. Para participar dos encontros, basta se inscrever no link: bit.ly/GrupoDeApoioPsicos.\n\n E mais uma vez obrigada! É muito bom saber que podemos contar com você.
  `;
  return `${individual_name}, aqui é a ${agent} da Rede de Apoio Psicológico. Vim te avisar que sua conexão com um(a) psicólogo(a) foi feita! Você pode entrar em contato com ${volunteer_name} pelo e-mail ${volunteer_email}. Se apresente e diga que quer marcar um horário para o atendimento. Juntos, vocês podem achar o melhor dia e hora para ambos :) \n\nSe por acaso seus horários forem incompatíveis, fale com a gente por este email para fazermos uma nova conexão: contato@rededeapoiopsicologico.org.br. \n\nEstamos juntos! Toda nossa admiração e agradecimento pelo seu trabalho <3 
  `;
};

export const emailValidation = (): RegExp =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const redirectToLogin = (): void => {
  const loginUrl =
    process.env.REACT_APP_LOGIN_URL ||
    "http://admin-canary.bonde.devel:5002/auth/login";
  window.location.href = `${loginUrl}?next=${window.location.href}`;
};

export const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
