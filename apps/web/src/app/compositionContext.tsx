import { createContext, useContext } from 'react';
import type { ExperienceComposition } from './composition';

const ExperienceCompositionContext = createContext<ExperienceComposition | null>(null);

interface ExperienceCompositionProviderProps {
  composition: ExperienceComposition;
  children: React.ReactNode;
}

export const ExperienceCompositionProvider = ({
  composition,
  children,
}: ExperienceCompositionProviderProps) => (
  <ExperienceCompositionContext.Provider value={composition}>
    {children}
  </ExperienceCompositionContext.Provider>
);

export const useExperienceComposition = () => {
  const composition = useContext(ExperienceCompositionContext);

  if (!composition) {
    throw new Error('Experience composition context is not available.');
  }

  return composition;
};
