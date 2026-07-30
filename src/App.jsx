import { Routes, Route } from 'react-router-dom';
import GlobalLayout from '@/layout/GlobalLayout';
import AuthLayout from '@/layout/AuthLayout';

import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

function App() {

  return (
    <>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
