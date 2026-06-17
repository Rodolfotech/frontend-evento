import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsApi, socialApi, attendeesApi, usersApi } from '../api';
import { InstagramLinkModal } from '../features/social/InstagramLinkModal';
import { Toast } from '../components/ui/Toast';
import { ProfileField } from '../components/ui/ProfileField';
import {
  Camera,
  SquarePen,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Save,
  X,
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [instagramAvatar, setInstagramAvatar] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    companyInstagram: '',
    website: '',
    companyRut: '',
    companyGiro: '',
    companyPhone: '',
    email: '',
    companyAddress: '',
    city: '',
    comuna: '',
    organizerRut: '',
    organizerPhone: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        companyInstagram: user.companyInstagram || '',
        website: user.website || '',
        companyRut: user.companyRut || '',
        companyGiro: user.companyGiro || '',
        companyPhone: user.companyPhone || '',
        email: user.email || '',
        companyAddress: user.companyAddress || '',
        city: user.city || '',
        comuna: user.comuna || '',
        organizerRut: user.organizerRut || '',
        organizerPhone: user.organizerPhone || '',
      });
    }
  }, [user]);

  const loadUser = useCallback(() => {
    eventsApi.getByOwner().catch(() => undefined);
    attendeesApi.findByUser().catch(() => undefined);
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

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    socialApi.getStatus().then(updateInstagramStatus).catch(() => undefined);
  }, [updateInstagramStatus]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersApi.updateProfile(form);
      setEditing(false);
      setToast({ message: 'Datos actualizados correctamente', type: 'success' });
    } catch {
      setToast({ message: 'Error al guardar los datos', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

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

  const set = (key: keyof typeof form) => (val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-sm"
                style={{ backgroundColor: '#2563EB' }}
              >
                {(form.name || '?').charAt(0).toUpperCase()}
              </div>
              {instagramConnected && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FFFFFF', border: '2px solid #F8FAFC' }}
                >
                  <Camera className="w-3.5 h-3.5" style={{ color: '#1D1D1F' }} />
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}>
                {form.name || 'Sin nombre'}
              </p>
              {instagramConnected && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mt-1"
                  style={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE' }}
                >
                  <Camera className="w-3 h-3" />
                  Instagram conectado
                </span>
              )}
            </div>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: '#1D1D1F99', border: '1px solid #E4EBFA', backgroundColor: '#FFFFFF' }}
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#2563EB' }}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
              style={{ color: '#2563EB', border: '1px solid #E4EBFA', backgroundColor: '#FFFFFF' }}
            >
              <SquarePen className="w-4 h-4" />
              Editar datos
            </button>
          )}
        </div>

        {/* ── Datos de empresa ── */}
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}>
            Datos de empresa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ProfileField label="Nombre de empresa" value={form.name} editing={editing} onChange={set('name')} />
            <ProfileField label="Instagram empresa" value={form.companyInstagram} editing={editing} onChange={set('companyInstagram')} placeholder="@empresa" />
            <ProfileField label="Sitio web" value={form.website} editing={editing} onChange={set('website')} placeholder="www.empresa.cl" />
            <ProfileField label="Rut de empresa" value={form.companyRut} editing={editing} onChange={set('companyRut')} placeholder="12345678-9" />
            <ProfileField label="Giro empresa" value={form.companyGiro} editing={editing} onChange={set('companyGiro')} placeholder="Turismo" />
            <ProfileField label="Teléfono empresa" value={form.companyPhone} editing={editing} onChange={set('companyPhone')} placeholder="+569 12345678" type="tel" />
            <ProfileField label="Correo electrónico empresa" value={form.email} editing={editing} onChange={set('email')} type="email" />
            <ProfileField label="Dirección de empresa" value={form.companyAddress} editing={editing} onChange={set('companyAddress')} placeholder="Calle 123" />
            <ProfileField label="Ciudad" value={form.city} editing={editing} onChange={set('city')} placeholder="Villarrica" />
            <ProfileField label="Comuna" value={form.comuna} editing={editing} onChange={set('comuna')} placeholder="Villarrica" />
          </div>
        </div>

        {/* ── Datos personales Organizador ── */}
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}>
            Datos personales Organizador
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ProfileField label="Rut organizador" value={form.organizerRut} editing={editing} onChange={set('organizerRut')} placeholder="12345678-9" />
            <ProfileField label="Teléfono organizador" value={form.organizerPhone} editing={editing} onChange={set('organizerPhone')} placeholder="+569 12345678" type="tel" />
          </div>
        </div>

        {/* ── Redes sociales ── */}
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}>
            Redes sociales
          </h2>
          <div
            className="flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium" style={{ color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}>
                Instagram
              </span>
            </div>

            {instagramConnected ? (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Vinculado
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE' }}
              >
                Vincular
              </button>
            )}
          </div>
        </div>

        {/* ── Acciones de cuenta ── */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #E4EBFA' }}>
          <button
            type="button"
            onClick={() => { logout(); window.location.href = '/'; }}
            className="text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: '#1D1D1F99' }}
          >
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: '#DC2626' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
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
