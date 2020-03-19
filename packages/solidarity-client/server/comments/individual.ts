const individualComment = ({
  volunteer_type: { type, registry_type },
  volunteer: { name, registry, tel },
  assignee_name,
  individual_name
}) => {
  return `\nOlá, ${individual_name}!\n\nBoa notícia!\n\nConseguimos localizar uma ${type.toLowerCase()} disponível próxima a você. Estamos te enviando os dados abaixo para que entre em contato em até 30 dias. É muito importante atentar-se a esse prazo pois, após esse período, a sua vaga irá expirar. Não se preocupe, caso você não consiga, poderá se cadastrar novamente no futuro.\n\n${type}: ${name}\nTelefone: ${tel}\n${registry_type}: ${registry}\n\nTodos os atendimentos do Mapa devem ser gratuitos pelo tempo que durarem. Caso você seja cobrada, comunique imediatamente a nossa equipe. No momento de contato com a voluntária, por favor, identifique que você buscou ajuda via Mapa do Acolhimento.\n\nAgradecemos pela coragem, pela confiança e esperamos que seja bem acolhida! Pedimos que entre em contato para compartilhar a sua experiência de atendimento.\n\nUm abraço,\n${assignee_name}, da equipe Mapa do Acolhimento`;
};

export default individualComment;
