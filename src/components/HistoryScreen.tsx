import type { Session } from '../types';
import { TRAINERS } from '../types/trainers';
import { useAppContext } from '../context/AppContext';
import {
  calculateStats,
  formatDelay,
} from '../utils';

export function HistoryScreen() {
  const {
    sessions,
    setScreen,
    setCurrentSession,
  } = useAppContext();

  const handleBackToSetup = () => {
    setScreen('setup');
  };

  const handleViewSessionDetails = (
    session: Session
  ) => {
    setCurrentSession(session);
    setScreen('results');
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="app-page">
        <header className="page-header">
          <div className="page-header-inner">
            <p className="eyebrow">Your training</p>

            <h1 className="page-title">
              History
            </h1>
          </div>
        </header>

        <main className="page-content">
          <div className="app-container">
            <div className="empty-state">
              <div className="empty-icon">
                →
              </div>

              <h2 className="empty-title">
                No sessions yet
              </h2>

              <p className="empty-description">
                Complete your first training session
                and your results will appear here.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={handleBackToSetup}
              >
                New Session
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-page">
      <header className="page-header">
        <div className="page-header-inner">
          <p className="eyebrow">Your training</p>

          <h1 className="page-title">
            History
          </h1>

          <p className="page-subtitle">
            {sessions.length}{' '}
            {sessions.length === 1
              ? 'session'
              : 'sessions'}{' '}
            completed.
          </p>
        </div>
      </header>

      <main className="page-content">
        <div className="app-container">

          <div className="history-list">
            {[...sessions]
              .reverse()
              .map((session) => {
                const stats =
                  calculateStats(
                    session.drills
                  );

                const trainer =
                  TRAINERS[
                    session.trainerId
                  ];

                const sessionDate =
                  new Date(
                    session.startTime
                  );

                return (
                  <article
                    key={session.id}
                    className="history-card"
                    onClick={() =>
                      handleViewSessionDetails(
                        session
                      )
                    }
                  >
                    <div className="history-grid">

                      <div>
                        <div className="history-label">
                          Trainer
                        </div>

                        <div className="history-value">
                          {trainer?.name ||
                            'Unknown'}
                        </div>
                      </div>

                      <div>
                        <div className="history-label">
                          Date
                        </div>

                        <div className="history-value">
                          {sessionDate.toLocaleDateString()}
                        </div>

                        <div className="history-small">
                          {sessionDate.toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                      </div>

                      <div className="history-stats">
                        <div>
                          <div className="history-stat-value">
                            {stats.totalReps}
                          </div>

                          <div className="history-stat-label">
                            Reps
                          </div>
                        </div>

                        <div>
                          <div className="history-stat-value">
                            {formatDelay(
                              stats.averageDelay
                            )}s
                          </div>

                          <div className="history-stat-label">
                            Avg
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="history-drills">
                      {Object.entries(
                        stats.drillFrequency
                      ).map(
                        ([drillName, count]) => (
                          <span
                            key={drillName}
                            className="drill-pill"
                          >
                            {drillName}:{' '}
                            {count as number}
                          </span>
                        )
                      )}
                    </div>
                  </article>
                );
              })}
          </div>

          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              className="action-button"
              style={{ width: '100%' }}
              onClick={handleBackToSetup}
            >
              New Session
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}