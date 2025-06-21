import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Post from './pages/Post/Post.jsx';
import NavigationBar from './components/Navbar/NavigationBar.jsx';
import CreatePost from './pages/Post/CreatePost.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SignUp } from './pages/signup/SignUp.jsx';
import { SignIn } from './pages/signin/SignIn.jsx';

const MainLayout = () => {
  return (
    <>
      <NavigationBar />
      <main>
        <Outlet />
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
      }
    ]
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
