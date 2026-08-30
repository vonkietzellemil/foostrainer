import { useEffect, useState } from 'react';
import { TRAINERS } from '../types/trainers';
import { useAppContext } from '../context/AppContext';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { useWakeLock } from '../hooks/useWakeLock';
import { playAudioCue, speakText } from '../utils';

export function TrainingScreen() {
  const {
    config,
    setScreen,
    setCurrentSession,
    addSession,
  } = useAppContext();

  const [isScreenFlashing, setIsScreenFlashing] =
    useState(false);

  const {
    currentRep,
    currentDrill,
    isPreparing,
    isDelaying,
    remainingTime,
    drillsCompleted,
    isSessionRunning,
    startSession,
    stopSession,
    getResults,
  } = useTrainingSession();

  /*
   * Start the training session.
   */
  useEffect(() => {
    if (config) {
      const trainer = TRAINERS[config.trainerId];

      startSession(
        config,
        config.trainerId,
        trainer.name
      );
    }
  }, [config, startSession]);

  /*
   * Play the cue when the drill becomes visible.
   */
  useEffect(() => {
    if (currentDrill && !isDelaying) {
      if (config?.playSoundCue) {
        playAudioCue();
      }

      if (config?.speakDrillName) {
        const trainer = TRAINERS[config.trainerId];

        const drill = trainer.drills.find(
          (d) => d.id === currentDrill
        );

        if (drill) {
          speakText(drill.name);
        }
      }

      if (config?.visualFlashCue) {
        // setIsScreenFlashing(true); Don't flash screen

        const timer = window.setTimeout(() => {
          setIsScreenFlashing(false);
        }, 150);

        return () => window.clearTimeout(timer);
      }
    }
  }, [
    currentDrill,
    isDelaying,
    config,
  ]);

  /*
   * Session completion is handled by the
   * "End Session" button instead.
   */

  useWakeLock(isSessionRunning);
  
  const handleStopSession = () => {
    const confirmed = window.confirm(
      'Stop this training session?'
    );

    if (!confirmed) {
      return;
    }

    const session = stopSession();

    if (session) {
      addSession(session);
      setCurrentSession(session);
      setScreen('results');
    }
  };

  const handleEndSession = () => {
    const session = getResults();

    if (!session) {
      return;
    }

    addSession(session);
    setCurrentSession(session);
    setScreen('results');
  };

  /*
   * Don't render anything until the configuration exists.
   */
  if (!config) {
    return null;
  }

  const trainer = TRAINERS[config.trainerId];

  const currentDrillObj = currentDrill
    ? trainer.drills.find(
        (d) => d.id === currentDrill
      )
    : null;

  const progress =
    config.numReps > 0
      ? (currentRep / config.numReps) * 100
      : 0;

  return (
    <div
      className={`training-screen ${
        isScreenFlashing ? 'flashing' : ''
      }`}
    >
      {/* =================================================
          TOP INFORMATION
          ================================================= */}
      <div className="training-top">
        <div className="training-meta">
          <div className="training-rep">
            REP {Math.min(currentRep, config.numReps)} /{' '}
            {config.numReps}
          </div>

          <div className="training-trainer">
            {trainer.name}
          </div>
        </div>

        <div className="training-progress">
          <div
            className="training-progress-bar"
            style={{
              width: `${Math.min(progress, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* =================================================
          MAIN TRAINING DISPLAY
          ================================================= */}
      <main className="training-main">
        <div className="training-content">

          {/* First preparation / preparation between reps */}
          {isPreparing && !currentDrill ? (
            <>
              <div className="training-phase">
                Prepare
              </div>

              <div className="training-countdown soft-pulse">
                {Math.ceil(remainingTime)}
              </div>
            </>
          ) : isDelaying ? (
            /* Hidden random reaction delay */
            <>
              <div className="training-phase">
                Get ready
              </div>

              <div className="training-countdown soft-pulse">
                ...
              </div>
            </>
          ) : currentDrill && currentDrillObj ? (
            /* Current drill */
            <>
              <div className="training-drill">
                {currentDrillObj.name}
              </div>

              <div className="training-execute">Execute</div>
              
              {/* Preparation for next rep */}
              {isPreparing && isSessionRunning && (
                <div className="training-next-rep">
                  <div className="training-next-rep-label">
                    Next rep in
                  </div>
                  
                  <div className="training-next-rep-countdown">
                    {Math.ceil(remainingTime)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="training-phase">
                Get ready
              </div>

              <div className="training-countdown soft-pulse">
                ...
              </div>
            </>
          )}

        </div>
      </main>


      {/* =================================================
          STOP / END SESSION
          ================================================= */}
      <div className="training-stop-area">
        {!isSessionRunning && drillsCompleted.length > 0 ? (
          <button
            type="button"
            className="primary-button"
            onClick={handleEndSession}
          >
            End Session
          </button>
        ) : (
          <button
            type="button"
            className="stop-button"
            onClick={handleStopSession}
          >
            Stop Training
          </button>
        )}
      </div>
    </div>
  );
}