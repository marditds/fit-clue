import { useOutletContext } from 'react-router-dom';
import './App.css';
import { LoadingPage } from './components/Loading/Loading';
import Home from './pages/home/Home';

function App() {

  const { isSignOutInProgress } = useOutletContext();

  if (isSignOutInProgress) {
    return <LoadingPage loadingText='Signing out' />
  }

  return (
    <>
      <Home />
    </>

  )
}

export default App
