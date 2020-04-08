import { Filters } from "../../services/FilterContext";

const data = {
  volunteers: "Psicólogas",
  individuals: "Profissionais da Saúde"
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
        !_filters.values.status._eq ? "Todas" : _filters.values.status._eq
      })`,
      items: [
        {
          onClick: (): void => _filters.change({ type: "status", value: undefined }),
          option: "Todas"
        },
        {
          onClick: (): void => _filters.change({ type: "status", value: "inscrita" }),
          option: "Inscrita"
        },
        {
          onClick: (): void => _filters.change({ type: "status", value: "reprovada" }),
          option: "Reprovada"
        },
        {
          onClick: (): void => _filters.change({ type: "status", value: "aprovada" }),
          option: "Aprovada"
        }
      ]
    },
    {
      name: `Disponibilidade (${
        !_filters.values.availability._eq
          ? "Todas"
          : _filters.values.availability._eq
      })`,
      items: [
        {
          onClick: (): void => _filters.change({ type: "availability", value: undefined }),
          option: "Todas"
        },
        {
          onClick: (): void => _filters.change({ type: "availability", value: "disponível" }),
          option: "Disponível"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "availability", value: "indisponível" }),
          option: "Indisponível"
        },
        {
          onClick: (): void => _filters.change({ type: "availability", value: "anti-ética" }),
          option: "Anti-ética"
        },
        {
          onClick: (): void => _filters.change({ type: "availability", value: "férias" }),
          option: "Férias"
        },
        {
          onClick: (): void => _filters.change({ type: "availability", value: "licença" }),
          option: "Licença"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "availability", value: "descadastrada" }),
          option: "Descadastrada"
        }
      ]
    }
  ];
}
