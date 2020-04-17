import { Filters } from "../../services/FilterProvider";

type FiltersProps = {
  volunteersCount: number;
  individualsCount: number;
  history: (string) => void;
  kind: string;
  filters: {
    values: Filters;
    change: (any) => void;
  };
  groups: Array<{ is_volunteer: boolean; name: string }>;
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
    option: `${c.name} (${
      c.is_volunteer ? volunteersCount : individualsCount
    })`,
    onClick: (): void =>
      history(c.is_volunteer ? "/groups/volunteers" : "/groups/individuals")
  }));

  const data = groups.reduce(
    (newObj, old) => ({
      ...newObj,
      [old.is_volunteer ? "volunteers" : "individuals"]: old.name
    }),
    {}
  );

  return [
    {
      name: data[kind] ? `Grupo (${data[kind]})` : "Grupo",
      items
    },
    {
      name: `Status (${
        !_filters.values.status._eq ? "Todas" : _filters.values.status._eq
      })`,
      items: [
        {
          onClick: (): void =>
            _filters.change({ type: "status", value: undefined }),
          option: "Todas"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "status", value: "inscrita" }),
          option: "Inscrita"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "status", value: "reprovada" }),
          option: "Reprovada"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "status", value: "aprovada" }),
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
          onClick: (): void =>
            _filters.change({ type: "availability", value: undefined }),
          option: "Todas"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "availability", value: "disponível" }),
          option: "Disponível"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "availability", value: "indisponível" }),
          option: "Indisponível"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "availability", value: "anti-ética" }),
          option: "Anti-ética"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "availability", value: "férias" }),
          option: "Férias"
        },
        {
          onClick: (): void =>
            _filters.change({ type: "availability", value: "licença" }),
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
