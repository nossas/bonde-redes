export default function filters({ volunteersCount, individualsCount, history }): any {
  return [
    {
      name: 'Grupo',
      items: [
        {
          onClick: () => history.push("/groups/volunteers"),
          option: `Voluntárias (${volunteersCount})`
        },
        {
          onClick: () => history.push("/groups/individuals"),
          option: `PSR's (${individualsCount})`
        }
      ]
    },
    {
      name: 'Status',
      items: [
        {
          onClick: () => alert("inscrita"),
          option: 'Inscrita'
        },
        {
          onClick: () => alert("Reprovada"),
          option: 'Reprovada'
        },
        {
          onClick: () => alert("Aprovada"),
          option: 'Aprovada'
        }
      ]
    },
    {
      name: 'Disponibilidade',
      items: [
        {
          onClick: () => alert("Disponível"),
          option: 'Disponível'
        },
        {
          onClick: () => alert("Indisponível"),
          option: 'Indisponível'
        },
        {
          onClick: () => alert("Anti-ética"),
          option: 'Anti-ética'
        },
        {
          onClick: () => alert("Férias"),
          option: 'Férias'
        },
        {
          onClick: () => alert("Licença"),
          option: 'Licença'
        },
        {
          onClick: () => alert("Descadastrada"),
          option: 'Descadastrada'
        }
      ]
    }
  ]
}
