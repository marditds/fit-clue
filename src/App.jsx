import { useOutletContext } from 'react-router-dom';
import './App.css';
import { LoadingPage } from './components/Loading/Loading';
import Featured from './pages/featured/Featured';

function App() {

  const { isSignOutInProgress } = useOutletContext();

  if (isSignOutInProgress) {
    return <LoadingPage loadingText='Signing out' />
  }

  return (
    <>
      <Featured />
    </>

  )
}

export default App
