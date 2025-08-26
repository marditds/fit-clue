import { useOutletContext } from 'react-router-dom';
import './App.css';
import { LoadingPage } from './components/Loading/Loading';
import TheLatest from './pages/the-latest/TheLatest';

function App() {

  const { isSignOutInProgress } = useOutletContext();

  if (isSignOutInProgress) {
    return <LoadingPage loadingText='Signing out' />
  }

  return (
    <>
      <TheLatest />
    </>

  )
}

export default App
