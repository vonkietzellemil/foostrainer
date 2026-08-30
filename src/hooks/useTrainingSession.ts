import { useState, useCallback, useRef } from 'react';
import type { DrillRecord, Session, TrainingConfig } from '../types';
import { ShuffleBag, getRandomDelay } from '../utils';
import { TRAINERS } from '../types/trainers';

interface UseTrainingSessionResult {
  currentRep: number;
  currentDrill: string | null;
  isDelaying: boolean;
  remainingTime: number;
  drillsCompleted: DrillRecord[];
  isSessionRunning: boolean;
  startSession: (config: TrainingConfig, trainerId: string, trainerName: string) => void;
  stopSession: () => Session | null;
  getResults: () => Session | null;
}

export function useTrainingSession(): UseTrainingSessionResult {
  const [currentRep, setCurrentRep] = useState(0);
  const [currentDrill, setCurrentDrill] = useState<string | null>(null);
  const [isDelaying, setIsDelaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [drillsCompleted, setDrillsCompleted] = useState<DrillRecord[]>([]);
  const [isSessionRunning, setIsSessionRunning] = useState(false);

  const sessionRef = useRef<Session | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shuffleBagRef = useRef<ShuffleBag | null>(null);
  const drillsCompletedRef = useRef<DrillRecord[]>([]);

  const startSession = useCallback(
    (config: TrainingConfig, trainerId: string, trainerName: string) => {
      sessionRef.current = {
        id: `session-${Date.now()}`,
        trainerId,
        trainerName,
        startTime: Date.now(),
        endTime: 0,
        config,
        drills: [],
      };

      shuffleBagRef.current = new ShuffleBag(config.selectedDrills);
      drillsCompletedRef.current = [];
      setCurrentRep(1);
      setDrillsCompleted([]);
      setIsSessionRunning(true);

      // Start first rep
      scheduleNextRep(config, trainerId, 0);
    },
    []
  );

  const scheduleNextRep = (config: TrainingConfig, trainerId: string, repIndex: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Schedule preparation interval
    timerRef.current = setTimeout(() => {
      // Preparation is over, show "Get Ready"
      setIsDelaying(true);
      const randomDelay = getRandomDelay(config.minDelay, config.maxDelay);
      setRemainingTime(Math.ceil(randomDelay / 1000));

      // Schedule drill reveal
      timerRef.current = setTimeout(() => {
        const drillId = shuffleBagRef.current!.next();
        
        // Find drill name from trainer config
        const trainer = TRAINERS[trainerId];
        const drill = trainer.drills.find((d) => d.id === drillId);
        const drillName = drill ? drill.name : drillId;
        
        const drillRecord: DrillRecord = {
          repNumber: repIndex + 1,
          drillId,
          drillName,
          randomDelay,
          timestamp: Date.now(),
        };

        drillsCompletedRef.current.push(drillRecord);
        setDrillsCompleted([...drillsCompletedRef.current]);
        setCurrentDrill(drillId);
        setIsDelaying(false);

        // Move to next rep
        if (repIndex + 1 < config.numReps) {
          setCurrentRep(repIndex + 2);
          scheduleNextRep(config, trainerId, repIndex + 1);
        } else {
          // Session complete
          setIsSessionRunning(false);
          if (sessionRef.current) {
            sessionRef.current.drills = drillsCompletedRef.current;
            sessionRef.current.endTime = Date.now();
          }
        }
      }, randomDelay);
    }, config.prepInterval * 1000);
  };

  const stopSession = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsSessionRunning(false);
    setCurrentDrill(null);

    if (sessionRef.current) {
      sessionRef.current.drills = drillsCompletedRef.current;
      sessionRef.current.endTime = Date.now();
      return sessionRef.current;
    }

    return null;
  }, []);

  const getResults = useCallback(() => {
    return sessionRef.current;
  }, []);

  return {
    currentRep,
    currentDrill,
    isDelaying,
    remainingTime,
    drillsCompleted,
    isSessionRunning,
    startSession,
    stopSession,
    getResults,
  };
}
