import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsApi, socialApi, attendeesApi, usersApi } from '../api';
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
  Trash2,
  AlertTriangle,
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await usersApi.deleteAccount();
      logout();
      window.location.href = '/';
    } catch {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setToast({ message: 'Error al eliminar la cuenta. Inténtalo de nuevo.', type: 'error' });
    }
  };

  const roleLabel = user?.role === 'ORGANIZER' ? 'Organizador' : user?.role === 'ADMIN' ? 'Admin' : 'Usuario';

  return (
    <div className="min-h-screen pt-16 flex items-start justify-center" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-md mx-4 pt-12 pb-20">

        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}>
          {/* Avatar */}
          <div className="text-center mb-5">
            <div
              className="w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-sm"
              style={{ backgroundColor: '#2563EB' }}
            >
              {(user?.name || '?').charAt(0).toUpperCase()}
            </div>
            <h1 className="text-lg font-bold" style={{ color: '#1D1D1F' }}>{user?.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: '#1D1D1F99' }}>{user?.email}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {user?.instagramId && (
                <span
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#FCE7F3', color: '#BE185D' }}
                >
                  <Camera className="w-3 h-3" />
                  Instagram conectado
                </span>
              )}
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: '#E4EBFA', color: '#2563EB' }}
              >
                {roleLabel}
              </span>
            </div>
          </div>

          <InstagramBadges validation={validation} />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl p-3 text-center border" style={{ backgroundColor: '#F8FAFC', borderColor: '#E4EBFA' }}>
              <Sparkles className="w-4 h-4 mx-auto mb-1" style={{ color: '#2563EB' }} />
              <p className="text-xl font-bold" style={{ color: '#1D1D1F' }}>{myEvents}</p>
              <p className="text-xs" style={{ color: '#1D1D1F99' }}>Eventos</p>
            </div>
            <div className="rounded-xl p-3 text-center border" style={{ backgroundColor: '#F8FAFC', borderColor: '#E4EBFA' }}>
              <CalendarCheck className="w-4 h-4 mx-auto mb-1" style={{ color: '#2563EB' }} />
              <p className="text-xl font-bold" style={{ color: '#1D1D1F' }}>{registeredEvents}</p>
              <p className="text-xs" style={{ color: '#1D1D1F99' }}>Inscripciones</p>
            </div>
          </div>

          {/* Instagram */}
          <div className="mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#1D1D1F99' }}>
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
          <div
            className="flex items-center justify-between text-xs py-3 border-t"
            style={{ color: '#1D1D1F99', borderColor: '#E4EBFA' }}
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" style={{ color: '#2563EB' }} />
              {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy", { locale: es }) : ''}
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" style={{ color: '#2563EB' }} />
              {roleLabel}
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={() => { logout(); window.location.href = '/'; }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all cursor-pointer mt-3"
            style={{ color: '#1D1D1F99', borderColor: '#E4EBFA', backgroundColor: '#F8FAFC' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563EB33'; e.currentTarget.style.color = '#1D1D1F'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E4EBFA'; e.currentTarget.style.color = '#1D1D1F99'; }}
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>

          {/* Delete account */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all cursor-pointer mt-2"
            style={{ color: '#DC2626', borderColor: '#FEE2E2', backgroundColor: '#FFF5F5' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFF5F5'; }}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar cuenta
          </button>
        </div>
      </div>

      {/* Modal eliminar cuenta */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: '#DC2626' }} />
              </div>
              <h2 className="text-base font-bold mb-1" style={{ color: '#1D1D1F' }}>¿Eliminar tu cuenta?</h2>
              <p className="text-sm" style={{ color: '#1D1D1F99' }}>
                Se eliminarán permanentemente tu perfil, eventos, inscripciones y conexión con Instagram. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-60 cursor-pointer"
                style={{ backgroundColor: '#DC2626' }}
              >
                {deleteLoading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="w-full px-4 py-2.5 rounded-xl text-sm border cursor-pointer"
                style={{ color: '#1D1D1F99', borderColor: '#E4EBFA', backgroundColor: '#F8FAFC' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
