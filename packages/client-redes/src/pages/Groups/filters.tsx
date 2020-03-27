const data = {
  'volunteers': 'Psicólogas',
  'individuals': 'Profissionais da Saúde'
}

export default function filters({ volunteersCount, individualsCount, history, kind, filters: _filters }: any): any {
  return [
    {
      name: `Grupo (${data[kind]})`,
      items: [
        {
          onClick: () => history.push("/groups/volunteers"),
          option: `Psicólogas (${volunteersCount})`
        },
        {
          onClick: () => history.push("/groups/individuals"),
          option: `Profissionais da Saúde (${individualsCount})`
        }
      ]
    },  
    {
      name: `Status (${!_filters.values.status ? "Todas" : _filters.values.status._eq})`,
      items: [
        {
          onClick: () => _filters.change({ status: 'all' }),
          option: 'Todas'
        },
        {
          onClick: () => _filters.change({ status: 'inscrita' }),
          option: 'Inscrita'
        },
        {
          onClick: () => _filters.change({ status: 'reprovada' }),
          option: 'Reprovada'
        },
        {
          onClick: () => _filters.change({ status: 'aprovada' }),
          option: 'Aprovada'
        }
      ]
    },
    {
      name: `Disponibilidade (${!_filters.values.availability ? "Todas" : _filters.values.availability._eq})`,
      items: [
        {
          onClick: () => _filters.change({ availability: 'all' }),
          option: 'Todas'
        },
        {
          onClick: () => _filters.change({ availability: 'disponível' }),
          option: 'Disponível'
        },
        {
          onClick: () => _filters.change({ availability: 'indisponível' }),
          option: 'Indisponível'
        },
        {
          onClick: () => _filters.change({ availability: 'anti-ética' }),
          option: 'Anti-ética'
        },
        {
          onClick: () => _filters.change({ availability: 'férias' }),
          option: 'Férias'
        },
        {
          onClick: () => _filters.change({ availability: 'licença' }),
          option: 'Licença'
        },
        {
          onClick: () => _filters.change({ availability: 'descadastrada' }),
          option: 'Descadastrada'
        }
      ]
    }
  ]
}