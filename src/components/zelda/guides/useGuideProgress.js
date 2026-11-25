import { useZeldaProgress } from "@/composables/useZeldaProgress";

export function useGuideProgress() {
  const { done, isDone, toggle } = useZeldaProgress();
  return { available: true, done, isDone, toggle };
}
