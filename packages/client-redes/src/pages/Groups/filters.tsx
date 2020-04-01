import { Filters } from "../../graphql/FilterQuery";

const data = {
  volunteers: 'Psicólogas',
  individuals: 'Profissionais da Saúde'
};

type FiltersProps = {
  volunteersCount: number;
  individualsCount: number;
  history: (string) => void;
  kind: string;
  filters: {
    values: Filters;
    change: (any) => void;
  };
};

type FilterData = {
  name: string;
  items: Array<{ onClick: () => void; option: string }>;
};

export default function filters({
  volunteersCount,
  individualsCount,
  history,
  kind,
  filters: _filters
}: FiltersProps): Array<FilterData> {
  return [
    {
      name: `Grupo (${data[kind]})`,
      items: [
        {
          onClick: (): void => history("/groups/volunteers"),
          option: `Psicólogas (${volunteersCount})`
        },
        {
          onClick: (): void => history("/groups/individuals"),
          option: `Profissionais da Saúde (${individualsCount})`
        }
      ]
    },
    {
      name: `Status (${
        !_filters.values.status ? "Todas" : _filters.values.status._eq
      })`,
      items: [
        {
          onClick: (): void => _filters.change({ status: "all" }),
          option: "Todas"
        },
        {
          onClick: (): void => _filters.change({ status: "inscrita" }),
          option: "Inscrita"
        },
        {
          onClick: (): void => _filters.change({ status: "reprovada" }),
          option: "Reprovada"
        },
        {
          onClick: (): void => _filters.change({ status: "aprovada" }),
          option: "Aprovada"
        }
      ]
    },
    {
      name: `Disponibilidade (${
        !_filters.values.availability
          ? "Todas"
          : _filters.values.availability._eq
      })`,
      items: [
        {
          onClick: (): void => _filters.change({ availability: "all" }),
          option: "Todas"
        },
        {
          onClick: (): void => _filters.change({ availability: "disponível" }),
          option: "Disponível"
        },
        {
          onClick: (): void =>
            _filters.change({ availability: "indisponível" }),
          option: "Indisponível"
        },
        {
          onClick: (): void => _filters.change({ availability: "anti-ética" }),
          option: "Anti-ética"
        },
        {
          onClick: (): void => _filters.change({ availability: "férias" }),
          option: "Férias"
        },
        {
          onClick: (): void => _filters.change({ availability: "licença" }),
          option: "Licença"
        },
        {
          onClick: (): void =>
            _filters.change({ availability: "descadastrada" }),
          option: "Descadastrada"
        }
      ]
    }
  ];
}
