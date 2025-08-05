import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { UserProvider, useUserContext } from './lib/context/UserContext.jsx';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx'
import Post from './pages/post/Post.jsx';
import NavigationBar from './components/Navigation/NavigationBar.jsx';
import CreatePost from './pages/post/CreatePost.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import SignIn from './pages/signin/SignIn.jsx';
import Dashboard from './pages/user/dashboard/Dashboard.jsx';
import ForgotPassword from './pages/forgot-password/ForgotPassword.jsx';
import ResetPassword from './pages/reset-password/ResetPassword';
import Footer from './components/Footer/Footer.jsx';
import Results from './pages/search/Results.jsx';
import { More } from './pages/personality/More.jsx';
import { AccountSettings } from './pages/user/dashboard/settings/AccountSettings.jsx';
import { SavedPosts } from './pages/user/dashboard/saved-posts/SavedPosts.jsx';
import TOS from './pages/tos/Tos.jsx';
import Privacy from './pages/privacy/Privacy.jsx';
import { CommunityGuidelines } from './pages/community-guidelines/CommunityGuidelines.jsx';

const MainLayout = () => {

  const {
    userId, setUserId,
    username, setUsername,
    email, setEmail,
    isLoggedIn, setIsLoggedIn,
    setIsSessionInProgress, setIsSignOutInProgress
  } = useUserContext();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <NavigationBar />
      <main style={{
        minHeight: 'calc(100vh - 112px)'
      }}>
        <Outlet context={{
          userId, setUserId,
          username, setUsername,
          email, setEmail,
          isLoggedIn, setIsLoggedIn,
          setIsSessionInProgress, setIsSignOutInProgress
        }} />
      </main>
      <Footer />
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
        path: 'personality',
        children: [
          {
            path: ':personalityName',
            children: [
              {
                path: 'more',
                element: <More />
              }
            ]
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: ':term',
            element: <Results />
          },
        ]
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Navigate to='settings' replace />
          },
          {
            path: 'settings',
            element: <AccountSettings />
          },
          {
            path: 'saved-posts',
            element: <SavedPosts />
          }
        ]
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
      {
        path: 'tos',
        element: <TOS />
      },
      {
        path: 'privacy',
        element: <Privacy />
      },
      {
        path: 'community-guidelines',
        element: <CommunityGuidelines />
      },
      {
        path: 'help',
        element: <SignIn />
      },
      {
        path: 'stuff',
        element: <SignIn />
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
