import { useState } from 'react';
import { TRAINERS, DEFAULT_TRAINER_ID } from '../types/trainers';
import type { TrainingConfig } from '../types';
import { useAppContext } from '../context/AppContext';

export function SetupScreen() {
  const { setScreen, setConfig } = useAppContext();

  const [trainerId, setTrainerId] = useState(DEFAULT_TRAINER_ID);
  const [prepInterval, setPrepInterval] = useState(5);
  const [numReps, setNumReps] = useState(20);

  const [selectedDrills, setSelectedDrills] = useState<string[]>(
    TRAINERS[DEFAULT_TRAINER_ID].drills.map((d) => d.id)
  );

  const [minDelay, setMinDelay] = useState(
    TRAINERS[DEFAULT_TRAINER_ID].defaultMinDelay
  );

  const [maxDelay, setMaxDelay] = useState(
    TRAINERS[DEFAULT_TRAINER_ID].defaultMaxDelay
  );

  const [playSoundCue, setPlaySoundCue] = useState(true);
  const [speakDrillName, setSpeakDrillName] = useState(false);
  const [visualFlashCue, setVisualFlashCue] = useState(true);

  const trainer = TRAINERS[trainerId];

  const handleTrainerChange = (newTrainerId: string) => {
    setTrainerId(newTrainerId);

    const newTrainer = TRAINERS[newTrainerId];

    setMinDelay(newTrainer.defaultMinDelay);
    setMaxDelay(newTrainer.defaultMaxDelay);
    setSelectedDrills(newTrainer.drills.map((d) => d.id));
  };

  const handleDrillToggle = (drillId: string) => {
    setSelectedDrills((prev) =>
      prev.includes(drillId)
        ? prev.filter((id) => id !== drillId)
        : [...prev, drillId]
    );
  };

  const handleSelectAllDrills = () => {
    setSelectedDrills(trainer.drills.map((d) => d.id));
  };

  const handleDeselectAllDrills = () => {
    setSelectedDrills([]);
  };

  const handleStartSession = () => {
    if (selectedDrills.length === 0) {
      alert('Please select at least one drill.');
      return;
    }

    const config: TrainingConfig = {
      trainerId,
      prepInterval,
      numReps,
      selectedDrills,
      minDelay,
      maxDelay,
      playSoundCue,
      speakDrillName,
      visualFlashCue,
    };

    setConfig(config);
    setScreen('training');
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <div className="page-header-inner">
          <p className="eyebrow">Reaction Training</p>

          <h1 className="page-title">Foos Trainer</h1>

          <p className="page-subtitle">
            Train your reaction. Remove anticipation.
          </p>
        </div>
      </header>

      <main className="page-content">
        <div className="app-container">

          {/* Trainer */}
          <section className="settings-card">
            <div className="section-heading">
              <p className="section-label">Trainer</p>
              <p className="section-description">
                Choose the foosball bar you are training.
              </p>
            </div>

            <div className="trainer-selector">
              {Object.values(TRAINERS).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`trainer-button ${
                    trainerId === t.id ? 'active' : ''
                  }`}
                  onClick={() => handleTrainerChange(t.id)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </section>

          {/* Session */}
          <section className="settings-card">
            <div className="section-heading">
              <p className="section-label">Session</p>
              <p className="section-description">
                Decide how often you are prompted.
              </p>
            </div>

            <div className="setting">
              <div className="setting-header">
                <div>
                  <div className="setting-title">Preparation interval</div>
                  <div className="setting-description">
                    Time between drills
                  </div>
                </div>

                <div className="setting-value">
                  {prepInterval}s
                </div>
              </div>

              <input
                className="range"
                type="range"
                min="1"
                max="60"
                value={prepInterval}
                onChange={(e) =>
                  setPrepInterval(Number(e.target.value))
                }
              />

              <div className="range-labels">
                <span>1 sec</span>
                <span>60 sec</span>
              </div>
            </div>

            <div className="setting">
              <div className="setting-header">
                <div>
                  <div className="setting-title">Repetitions</div>
                  <div className="setting-description">
                    Total drills in this session
                  </div>
                </div>

                <div className="setting-value">
                  {numReps}
                </div>
              </div>

              <input
                className="range"
                type="range"
                min="1"
                max="100"
                value={numReps}
                onChange={(e) =>
                  setNumReps(Number(e.target.value))
                }
              />

              <div className="range-labels">
                <span>1 rep</span>
                <span>100 reps</span>
              </div>
            </div>
          </section>

          {/* Drills */}
          <section className="settings-card">
            <div className="section-heading">
              <p className="section-label">Drills</p>
              <p className="section-description">
                Select what you want to train.
              </p>
            </div>

            <div className="drill-list">
              {trainer.drills.map((drill) => {
                const selected = selectedDrills.includes(drill.id);

                return (
                  <label
                    key={drill.id}
                    className={`drill-option ${
                      selected ? 'selected' : ''
                    }`}
                  >
                    <input
                      className="drill-checkbox"
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        handleDrillToggle(drill.id)
                      }
                    />

                    <span className="drill-name">
                      {drill.name}
                    </span>

                    {selected && (
                      <span className="drill-check">✓</span>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="selection-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleSelectAllDrills}
              >
                Select all
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleDeselectAllDrills}
              >
                Clear
              </button>
            </div>
          </section>

          {/* Random delay */}
          <section className="settings-card">
            <div className="section-heading">
              <p className="section-label">Random delay</p>
              <p className="section-description">
                The drill stays hidden during this period.
              </p>
            </div>

            <div className="setting">
              <div className="setting-header">
                <div>
                  <div className="setting-title">Minimum</div>
                </div>

                <div className="setting-value">
                  {minDelay}s
                </div>
              </div>

              <input
                className="range"
                type="range"
                min="0"
                max={trainer.defaultMaxDelay}
                value={minDelay}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setMinDelay(value);

                  if (value > maxDelay) {
                    setMaxDelay(value);
                  }
                }}
              />
            </div>

            <div className="setting">
              <div className="setting-header">
                <div>
                  <div className="setting-title">Maximum</div>
                </div>

                <div className="setting-value">
                  {maxDelay}s
                </div>
              </div>

              <input
                className="range"
                type="range"
                min={minDelay}
                max={trainer.defaultMaxDelay}
                value={maxDelay}
                onChange={(e) =>
                  setMaxDelay(Number(e.target.value))
                }
              />
            </div>
          </section>

          {/* Cues */}
          <section className="settings-card">
            <div className="section-heading">
              <p className="section-label">Cues</p>
              <p className="section-description">
                Choose how the trainer alerts you.
              </p>
            </div>

            <div className="cue-list">
              <label className="cue-option">
                <span className="cue-text">
                  <span className="cue-title">Audio beep</span>
                  <span className="cue-description">
                    Sound when the drill is revealed
                  </span>
                </span>

                <input
                  className="toggle"
                  type="checkbox"
                  checked={playSoundCue}
                  onChange={(e) =>
                    setPlaySoundCue(e.target.checked)
                  }
                />
              </label>

              <label className="cue-option">
                <span className="cue-text">
                  <span className="cue-title">
                    Speak drill name
                  </span>
                  <span className="cue-description">
                    Announce the drill out loud
                  </span>
                </span>

                <input
                  className="toggle"
                  type="checkbox"
                  checked={speakDrillName}
                  onChange={(e) =>
                    setSpeakDrillName(e.target.checked)
                  }
                />
              </label>

              <label className="cue-option">
                <span className="cue-text">
                  <span className="cue-title">
                    Visual flash
                  </span>
                  <span className="cue-description">
                    Flash the screen when revealed
                  </span>
                </span>

                <input
                  className="toggle"
                  type="checkbox"
                  checked={visualFlashCue}
                  onChange={(e) =>
                    setVisualFlashCue(e.target.checked)
                  }
                />
              </label>
            </div>
          </section>
        </div>
      </main>

      <div className="bottom-action">
        <div className="bottom-action-inner">
          <button
            type="button"
            className="primary-button"
            onClick={handleStartSession}
          >
            Start Training
          </button>
        </div>
      </div>
    </div>
  );
}