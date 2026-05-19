import {DetailList, ResourceState} from "../../components/common";

const stackDetails = [
  {
    label: "Route",
    value: "Keep file routes thin and compose feature components inside them.",
  },
  {
    label: "Feature",
    value: "Colocate queries, hooks, state, and feature-only components.",
    badge: "src/features",
  },
  {
    label: "Common UI",
    value: "Promote components only when they are reusable across features.",
    badge: "components/common",
  },
];

export function ExampleFeature() {
  return (
    <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
      <DetailList
        title="Example feature shape"
        description="This is intentionally small: a route imports a feature, and the feature uses common components plus UI primitives."
        items={stackDetails}
      />
      <ResourceState
        title="Delete-friendly by design"
        description="If this example stops being useful, remove src/features/example and this section from the home route."
      />
    </section>
  );
}
