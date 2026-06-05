import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsApi, socialApi, attendeesApi } from '../api';
import { InstagramConnectButton } from '../features/social/InstagramConnectButton';
import { InstagramLinkModal } from '../features/social/InstagramLinkModal';
import { InstagramBadges } from '../features/social/InstagramBadges';
import { Toast } from '../components/ui/Toast';
import {
  Camera,
  Sparkles,
  LogOut,
  CalendarCheck,
  Clock,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Profile() {
  const { user, logout } = useAuth();
  const [myEvents, setMyEvents] = useState<number>(0);
  const [registeredEvents, setRegisteredEvents] = useState<number>(0);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [instagramAvatar, setInstagramAvatar] = useState<string | null>(null);
  const [validation, setValidation] = useState<{
    isProfessional: boolean;
    hasMinAge: boolean;
    hasMinPosts: boolean;
    level: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadUser = useCallback(() => {
    eventsApi.getByOwner()
      .then((eventsRes) => setMyEvents(eventsRes.data?.length || 0))
      .catch(() => undefined);
    attendeesApi.findByUser()
      .then((attendeesRes) => setRegisteredEvents(attendeesRes.data?.length || 0))
      .catch(() => undefined);
  }, []);

  const updateInstagramStatus = useCallback(({ data }: { data: { instagram: boolean; instagramUsername: string | null; instagramAvatar: string | null } }) => {
    setInstagramConnected(data.instagram);
    setInstagramUsername(data.instagramUsername);
    setInstagramAvatar(data.instagramAvatar);
  }, []);

  const handleLinkSuccess = useCallback(() => {
    setToast({ message: 'Vinculación con Instagram correcta', type: 'success' });
    socialApi.getStatus().then(updateInstagramStatus).catch(() => undefined);
    loadUser();
  }, [updateInstagramStatus, loadUser]);

  const handleLinkError = useCallback((msg: string) => {
    setToast({ message: msg, type: 'error' });
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (instagramConnected) {
      socialApi.getValidation().then(({ data }) => setValidation(data)).catch(() => {});
    }
  }, [instagramConnected]);

  const roleLabel = user?.role === 'ORGANIZER' ? 'Organizador' : user?.role === 'ADMIN' ? 'Admin' : 'Usuario';

  return (
    <div className="min-h-screen pt-16 flex items-start justify-center">
      <div className="relative w-full max-w-md mx-4 pt-12 pb-20">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-neon-pink/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[300px] h-[300px] bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative glass rounded-2xl p-6 glow-pink">
          {/* Avatar */}
          <div className="text-center mb-5">
            <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-neon-purple/20 ring-2 ring-white/10">
              {(user?.name || '?').charAt(0).toUpperCase()}
            </div>
            <h1 className="text-lg font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {user?.instagramId && (
                <span className="inline-flex items-center gap-1 text-xs text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                  <Camera className="w-3 h-3" />
                  Instagram conectado
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium text-neon-cyan bg-white/5 px-2.5 py-0.5 rounded-full">
                {roleLabel}
              </span>
            </div>
          </div>

          <InstagramBadges validation={validation} />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="glass rounded-xl p-3 text-center">
              <Sparkles className="w-4 h-4 mx-auto mb-1 text-neon-cyan" />
              <p className="text-xl font-bold text-white">{myEvents}</p>
              <p className="text-xs text-gray-400">Eventos</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <CalendarCheck className="w-4 h-4 mx-auto mb-1 text-neon-purple" />
              <p className="text-xl font-bold text-white">{registeredEvents}</p>
              <p className="text-xs text-gray-400">Inscripciones</p>
            </div>
          </div>

          {/* Instagram */}
          <div className="mb-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Redes Sociales
            </h2>
            <InstagramConnectButton
              connected={instagramConnected}
              username={instagramUsername}
              avatar={instagramAvatar}
              onConnect={() => setShowModal(true)}
              onDisconnect={async () => {
                try {
                  await socialApi.disconnect('instagram');
                  setInstagramConnected(false);
                  setInstagramUsername(null);
                  setInstagramAvatar(null);
                  setValidation(null);
                  loadUser();
                  setToast({ message: 'Instagram desvinculado correctamente', type: 'success' });
                } catch {
                  setToast({ message: 'Error al desvincular Instagram', type: 'error' });
                }
              }}
              onChangeAccount={() => setShowModal(true)}
            />
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 py-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy", { locale: es }) : ''}
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              {roleLabel}
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={() => { logout(); window.location.href = '/'; }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-gray-400 hover:text-neon-pink hover:border-neon-pink/20 transition-all cursor-pointer mt-3"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <InstagramLinkModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleLinkSuccess}
        onError={handleLinkError}
      />
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        visible={!!toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
