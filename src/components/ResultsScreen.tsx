import { TRAINERS } from '../types/trainers';
import { useAppContext } from '../context/AppContext';
import {
  calculateStats,
  formatDelay,
  exportSessionAsCSV,
  exportSessionAsJSON,
  downloadFile,
} from '../utils';

export function ResultsScreen() {
  const {
    currentSession,
    setScreen,
    setCurrentSession,
  } = useAppContext();

  if (!currentSession) {
    return null;
  }

  const stats = calculateStats(
    currentSession.drills
  );

  const trainer =
    TRAINERS[currentSession.trainerId];

  const sessionDate =
    new Date(currentSession.startTime);

  const sessionDuration = Math.round(
    (currentSession.endTime -
      currentSession.startTime) /
      1000
  );

  const handleExportCSV = () => {
    const csv =
      exportSessionAsCSV(currentSession);

    downloadFile(
      csv,
      `foos-trainer-${currentSession.id}.csv`,
      'text/csv'
    );
  };

  const handleExportJSON = () => {
    const json =
      exportSessionAsJSON(currentSession);

    downloadFile(
      json,
      `foos-trainer-${currentSession.id}.json`,
      'application/json'
    );
  };

  const handleBackToSetup = () => {
    setCurrentSession(null);
    setScreen('setup');
  };

  const handleViewHistory = () => {
    setScreen('history');
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <div className="page-header-inner">
          <p className="eyebrow">Training complete</p>

          <h1 className="page-title">
            Session Results
          </h1>

          <p className="page-subtitle">
            {trainer?.name || 'Trainer'} ·{' '}
            {sessionDate.toLocaleDateString()}{' '}
            {sessionDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </header>

      <main className="page-content">
        <div className="app-container">

          {/* Key stats */}
          <section className="result-grid">
            <div className="stat-card">
              <div className="stat-label">
                Reps
              </div>

              <div className="stat-value">
                {stats.totalReps}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                Average
              </div>

              <div className="stat-value">
                {formatDelay(
                  stats.averageDelay
                )}s
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                Fastest
              </div>

              <div className="stat-value success">
                {formatDelay(
                  stats.fastestDelay
                )}s
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                Longest
              </div>

              <div className="stat-value warning">
                {formatDelay(
                  stats.longestDelay
                )}s
              </div>
            </div>
          </section>

          {/* Session details */}
          <section className="result-card">
            <div className="section-heading">
              <p className="section-label">
                Session
              </p>
            </div>

            <div className="meta-grid">
              <div>
                <div className="meta-label">
                  Duration
                </div>

                <div className="meta-value">
                  {sessionDuration}s
                </div>
              </div>

              <div>
                <div className="meta-label">
                  Random delay
                </div>

                <div className="meta-value">
                  {currentSession.config.minDelay}s –{' '}
                  {currentSession.config.maxDelay}s
                </div>
              </div>
            </div>
          </section>

          {/* Distribution */}
          <section className="result-card">
            <div className="section-heading">
              <p className="section-label">
                Drill distribution
              </p>

              <p className="section-description">
                How often each drill appeared.
              </p>
            </div>

            {Object.entries(
              stats.drillFrequency
            ).map(([drillName, count]) => {
              const countNum = count as number;

              const percentage =
                stats.totalReps > 0
                  ? Math.round(
                      (countNum /
                        stats.totalReps) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={drillName}
                  className="distribution-item"
                >
                  <div className="distribution-header">
                    <span className="distribution-name">
                      {drillName}
                    </span>

                    <span className="distribution-count">
                      {countNum} · {percentage}%
                    </span>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          {/* Detailed results */}
          <section className="result-card">
            <div className="section-heading">
              <p className="section-label">
                Detailed results
              </p>
            </div>

            <div className="table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Rep</th>
                    <th>Drill</th>
                    <th>Reaction delay</th>
                  </tr>
                </thead>

                <tbody>
                  {currentSession.drills.map(
                    (drill, index) => (
                      <tr key={index}>
                        <td>
                          {drill.repNumber}
                        </td>

                        <td>
                          {drill.drillName}
                        </td>

                        <td>
                          <span className="delay-value">
                            {formatDelay(
                              drill.randomDelay
                            )}s
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Actions */}
          <section className="result-card">
            <div className="action-grid">
              <button
                type="button"
                className="action-button"
                onClick={handleExportCSV}
              >
                Export CSV
              </button>

              <button
                type="button"
                className="action-button"
                onClick={handleExportJSON}
              >
                Export JSON
              </button>

              <button
                type="button"
                className="action-button"
                onClick={handleViewHistory}
              >
                History
              </button>

              <button
                type="button"
                className="action-button accent"
                onClick={handleBackToSetup}
              >
                New Session
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}