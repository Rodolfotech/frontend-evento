import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
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
      <Routes>
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/social/callback" element={<SocialCallback />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/terminosdelservicio" element={<TermsOfService />} />
          <Route path="/eliminacion-datos" element={<DataDeletion />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
