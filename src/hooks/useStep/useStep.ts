import { setPriority } from 'os';
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';

interface Methods {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  reset: () => void;
  canGoToNextStep: boolean;
  canGoToPrevStep: boolean;
  setStep: Dispatch<SetStateAction<number>>;
}

export default function useStep(maxStep: number): [number, Methods] {
  const [currentStep, setCurrentStep] = useState(1);

  const canGoToNextStep = useMemo(() => currentStep + 1 <= maxStep, [currentStep, maxStep]);

  const canGoToPrevStep = useMemo(() => currentStep - 1 >= 1, [currentStep]);

  const setStep = useCallback(
    step => {
      const newStep = step instanceof Function ? step(currentStep) : step;

      if (newStep >= 1 && newStep <= maxStep) {
        setCurrentStep(newStep);
        return;
      }
      throw new Error('Step not valid');
    },
    [maxStep, currentStep],
  );

  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep(step => step + 1);
    }
  }, [canGoToNextStep]);

  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep(step => step - 1);
    }
  }, [canGoToPrevStep]);

  const reset = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      reset,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
    },
  ];
}
