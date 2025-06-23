import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { UserProvider, useUserContext } from './lib/context/UserContext.jsx';
import './index.css'
import App from './App.jsx'
import Post from './pages/Post/Post.jsx';
import NavigationBar from './components/Navbar/NavigationBar.jsx';
import CreatePost from './pages/Post/CreatePost.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SignUp } from './pages/signup/SignUp.jsx';
import { SignIn } from './pages/signin/SignIn.jsx';
import { Dashboard } from './pages/user/dashboard/Dashboard.jsx';
import { ForgotPassword } from './pages/forgotPassword/ForgotPassword.jsx';
import { ResetPassword } from './pages/resetPassword/ResetPassword';

const MainLayout = () => {

  const {
    userId, setUserId,
    sessionId, setSessionId,
    username, setUsername,
    isLoggedIn, setIsLoggedIn,
    setIsSessionInProgress, setIsSignOutInProgress
  } = useUserContext();

  return (
    <>
      <NavigationBar />
      <main>
        <Outlet context={{
          userId, setUserId,
          sessionId, setSessionId,
          username, setUsername,
          isLoggedIn, setIsLoggedIn,
          setIsSessionInProgress, setIsSignOutInProgress
        }} />
      </main>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <App /> },
      {
        path: 'post',
        children: [
          {
            path: ':postId',
            element: <Post />
          },
          {
            path: 'create',
            element: <CreatePost />
          },
        ]
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'sign-up',
        element: <SignUp />
      },
      {
        path: 'sign-in',
        element: <SignIn />
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      },
    ]
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
