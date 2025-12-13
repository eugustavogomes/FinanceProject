import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import TransactionsPage from '../pages/TransactionsPage'
import CategoriesPage from '../pages/CategoriesPage'
import GoalsPage from '../pages/GoalsPage'
import ProfilePage from '../pages/ProfilePage'
import InvestmentsPage from '../pages/InvestmentsPage'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

type AppRoute = {
    path: string
    element: ReactNode
    protected?: boolean
}

const appRoutes: AppRoute[] = [
    { path: '/login', element: <LoginPage /> },
    { path: '/dashboard', element: <DashboardPage />, protected: true },
    { path: '/transactions', element: <TransactionsPage />, protected: true },
    { path: '/categories', element: <CategoriesPage />, protected: true },
    { path: '/goals', element: <GoalsPage />, protected: true },
    { path: '/profile', element: <ProfilePage />, protected: true },
    { path: '/investments', element: <InvestmentsPage />, protected: true },
]

export default function AppRoutes() {
    const { isAuthenticated } = useAuth()

    return (
        <Routes>
            {appRoutes.map((r) => (
                <Route
                    key={r.path}
                    path={r.path}
                    element={
                        r.protected ? (isAuthenticated() ? r.element : <Navigate to="/login" replace />) : r.element
                    }
                />
            ))}

            <Route path="/" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
