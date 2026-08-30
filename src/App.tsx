import { useAppContext } from './context/AppContext';
import { SetupScreen } from './components/SetupScreen';
import { TrainingScreen } from './components/TrainingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { HistoryScreen } from './components/HistoryScreen';

function AppContent() {
  const { screen } = useAppContext();

  return (
    <>
      {screen === 'setup' && <SetupScreen />}
      {screen === 'training' && <TrainingScreen />}
      {screen === 'results' && <ResultsScreen />}
      {screen === 'history' && <HistoryScreen />}
    </>
  );
}

export default AppContent;