import { Filters } from "../../graphql/FilterQuery";

type FiltersProps = {
  volunteersCount: number;
  individualsCount: number;
  history: (string) => void;
  kind: string;
  filters: {
    values: Filters;
    change: (any) => void;
  }
  groups: Array<{ is_volunteer: boolean, name: string }>
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
  groups,
  filters: _filters
}: FiltersProps): Array<FilterData> {
  const items = groups.map(c => ({
    option: `${c.name} (${c.is_volunteer ? volunteersCount : individualsCount})`,
    onClick: (): void => history(c.is_volunteer ? "/groups/volunteers" : "/groups/individuals")
  }))

  const data = groups.reduce((newObj, old) => ({ ...newObj, [old.is_volunteer ? "volunteers" : "individuals"]: old.name }), {})

  return [
    {
      name: `Grupo (${data[kind]})`,
      items
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
