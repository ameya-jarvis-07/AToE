import { useParams } from "react-router-dom";
import { cafes, states } from "../data/seed";
import { useTitle } from "../hooks/useTitle";
import NotFound from "./NotFound";
import CafeSequencePage from "../features/cafe/CafeSequencePage";

export default function CafePage() {
  const { cafeSlug = "" } = useParams();
  const cafe = cafes.find((item) => item.slug === cafeSlug && item.published);
  const state = states.find((item) => item.id === cafe?.stateId);
  useTitle(cafe?.name ?? "Hospitality not found", cafe?.description ?? "This hospitality could not be found.");
  if (!cafe) return <NotFound kind="hospitality" />;
  return <CafeSequencePage cafe={cafe} state={state} />;
}
