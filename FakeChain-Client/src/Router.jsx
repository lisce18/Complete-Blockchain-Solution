import { createBrowserRouter } from 'react-router-dom';
import { Explorer } from './Pages/Explorer';
import { Home } from './Pages/Home';
import { Layout } from './Pages/Layout';
import { Mine } from './Pages/Mine';
import { NotFound } from './Pages/NotFound';
import { Transaction } from './Pages/Transaction';

export const router = createBrowserRouter([
  {
    path: '/fakechain/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/fakechain/home',
        element: <Home />,
      },
      {
        path: '/fakechain/transact',
        element: <Transaction />,
      },
      {
        path: '/fakechain/mine',
        element: <Mine />,
      },
      {
        path: '/fakechain/explorer',
        element: <Explorer />,
      },
    ],
  },
]);
