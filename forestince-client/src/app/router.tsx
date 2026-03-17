import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { NotFoundPage } from './routes/not-found'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
