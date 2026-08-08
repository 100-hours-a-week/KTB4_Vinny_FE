import { Navigate, Routes, Route } from 'react-router-dom';
import GlobalLayout from '@/layout/GlobalLayout';
import AuthLayout from '@/layout/AuthLayout';
import MainLayout from '@/layout/MainLayout';
import SettingsLayout from '@/layout/SettingsLayout';

import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import HomePage from '@/pages/HomePage';
import MovieDetailPage from '@/pages/MovieDetailPage';
import MovieListPage from '@/pages/MovieListPage';
import SearchPage from '@/pages/SearchPage';
import ProfileEditPage from '@/pages/ProfileEditPage';
import PasswordEditPage from '@/pages/PasswordEditPage';

function App() {

  return (
    <>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MovieListPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movies/:tmdbMovieId" element={<MovieDetailPage />} />
          </Route>
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileEditPage />} />
            <Route path="password" element={<PasswordEditPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
