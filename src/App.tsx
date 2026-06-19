import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import AuthGuard from './routes/AuthGuard';
import AdminGuard from './routes/AdminGuard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import SocialCallback from './pages/SocialCallback';
import GoogleCallback from './pages/GoogleCallback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DataDeletion from './pages/DataDeletion';
import CategoryEvents from './pages/CategoryEvents';
import { ADMIN_ROUTE } from './constants/admin';

const Admin = lazy(() => import('./pages/Admin'));

function Layout() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/social/callback" element={<SocialCallback />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categorias/:slug" element={<EventDetail />} />
            <Route path="/:category" element={<CategoryEvents />} />
            <Route element={<AuthGuard />}>
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminosdelservicio" element={<TermsOfService />} />
            <Route path="/eliminacion-datos" element={<DataDeletion />} />
            <Route path={ADMIN_ROUTE} element={<AdminGuard><Admin /></AdminGuard>} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
