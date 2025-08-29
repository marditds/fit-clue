import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { UserProvider, useUserContext } from './lib/context/UserContext.jsx';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx';
import Post from './pages/post/Post.jsx';
import NavigationBar from './components/Navigation/NavigationBar.jsx';
import CreatePost from './pages/post/CreatePost.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import SignIn from './pages/signin/SignIn.jsx';
import Dashboard from './pages/user/dashboard/Dashboard.jsx';
import ForgotPassword from './pages/forgot-password/ForgotPassword.jsx';
import ResetPassword from './pages/reset-password/ResetPassword';
import Footer from './components/Navigation/Footer.jsx';
import Results from './pages/search/Results.jsx';
import { AccountSettings } from './pages/user/dashboard/settings/AccountSettings.jsx';
import { SavedPosts } from './pages/user/dashboard/saved-posts/SavedPosts.jsx';
import TOS from './pages/tos/TOS.jsx';
import Privacy from './pages/privacy/Privacy.jsx';
import { CommunityGuidelines } from './pages/community-guidelines/CommunityGuidelines.jsx';
import { redirectIfLoggedIn, redirectIfNotLoggedIn } from './lib/utils/authUtils.js';
import NotFound from './pages/not-found/NotFound.jsx';
import SignOut from './pages/signout/SignOut.jsx';
import { ToastGeneral } from './components/Accessories/ToastComponent.jsx';
import FAQ from './pages/faq/FAQ.jsx';
import About from './pages/about/About.jsx';

const MainLayout = () => {

  const {
    userId, setUserId,
    username, setUsername,
    email, setEmail,
    isLoggedIn, setIsLoggedIn,
    setIsSessionInProgress, setIsSignOutInProgress,
    isSignOutSucessful, setIsSignOutSucessful,
    signOutSucessMsg, setSignOutSucessMsg
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
          setIsSessionInProgress, setIsSignOutInProgress,
          isSignOutSucessful, setIsSignOutSucessful,
          signOutSucessMsg, setSignOutSucessMsg
        }} />

        {
          isSignOutSucessful &&
          <ToastGeneral
            signOutSucessMsg={signOutSucessMsg}
            setIsSignOutSucessful={setIsSignOutSucessful}
          />
        }

      </main>
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    // errorElement: <NotFound />,
    children: [
      { index: true, element: <App /> },
      {
        path: '*',
        element: <NotFound />
      },
      {
        path: 'post',
        children: [
          {
            path: ':postId',
            element: <Post />
          },
          {
            path: 'create',
            loader: () => redirectIfNotLoggedIn('sign-in'),
            element: <CreatePost />
          },
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: ':category/:term',
            element: <Results />
          },
        ]
      },
      {
        path: 'dashboard',
        loader: () => redirectIfNotLoggedIn('sign-in'),
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Navigate to='settings' replace />
          },
          {
            path: '*',
            element: <NotFound />
          },
          {
            path: 'settings',
            element: <AccountSettings />
          },
          {
            path: 'saved-posts',
            element: <SavedPosts />
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
            path: 'faq',
            element: <FAQ />
          }
        ]
      },
      {
        path: 'sign-up',
        loader: () => redirectIfLoggedIn(),
        element: <SignUp />
      },
      {
        path: 'sign-in',
        loader: () => redirectIfLoggedIn(),
        element: <SignIn />
      },
      {
        path: 'sign-out',
        loader: () => redirectIfNotLoggedIn(),
        element: <SignOut />
      },
      {
        path: 'forgot-password',
        loader: () => redirectIfLoggedIn(),
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
        path: 'faq',
        element: <FAQ />
      },
      {
        path: 'about',
        element: <About />
      }
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
