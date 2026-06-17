import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsApi, socialApi, attendeesApi } from '../api';
import { clearCache } from '../api/eventsCache';
import EventCard from '../features/events/EventCard';
import CreateEventForm from '../features/events/CreateEventForm';
import { InstagramPostPublisher } from '../features/social/InstagramPostPublisher';
import type { Event, SocialPost } from '../types';
import {
  Camera,
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
  X,
  Clock,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit3,
} from 'lucide-react';
import { Pagination } from '../components/ui/Pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { COMUNAS } from '../constants/comunas';

type Tab = 'myevents' | 'registered' | 'instagram';

export default function CreateEventPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('myevents');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [, setRegisteredEvents] = useState<Event[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<SocialPost[]>([]);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [instagramAvatar, setInstagramAvatar] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [filter, setFilter] = useState('');
  const [postPage, setPostPage] = useState(1);
  const [myEventsPage, setMyEventsPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const updateInstagramStatus = useCallback(({ data }: { data: { instagram: boolean; instagramUsername: string | null; instagramAvatar: string | null } }) => {
    setInstagramConnected(data.instagram);
    setInstagramUsername(data.instagramUsername);
    setInstagramAvatar(data.instagramAvatar);
  }, []);

  const loadUser = useCallback(() => {
    eventsApi.getByOwner()
      .then((eventsRes) => setMyEvents(eventsRes.data))
      .catch(() => undefined);
    attendeesApi.findByUser()
      .then((attendeesRes) => setRegisteredEvents(attendeesRes.data?.map((a: { event: Event }) => a.event) || []))
      .catch(() => undefined);
    socialApi.getStatus()
      .then(updateInstagramStatus)
      .catch(() => undefined);
  }, [updateInstagramStatus]);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadUser();
  }, [isAuthenticated, navigate, loadUser]);

  const handleInstagramLink = async () => {
    try {
      const { data } = await socialApi.getInstagramAuthUrl();
      const w = 600, h = 700;
      const x = window.screenX + (window.innerWidth - w) / 2;
      const y = window.screenY + (window.innerHeight - h) / 2;
      window.open(data.url, 'instagram-auth', `width=${w},height=${h},left=${x},top=${y},popup=1`);
    } catch { /* noop */ }
  };

  useEffect(() => {
    if (tab !== 'instagram') return;
    socialApi.getUserMedia().then(({ data }) => setInstagramPosts(data)).catch(() => undefined);
  }, [tab]);

  const POST_PAGE_SIZE = 3;
  const MY_EVENTS_PAGE_SIZE = 3;

  const filteredPosts = instagramPosts
    .filter((p) => !!p.media_url)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .filter((p) => !filter || (p.caption || '').toLowerCase().includes(filter.toLowerCase()));

  const postTotalPages = Math.ceil(filteredPosts.length / POST_PAGE_SIZE);
  const visiblePosts = filteredPosts.slice((postPage - 1) * POST_PAGE_SIZE, postPage * POST_PAGE_SIZE);

  const myEventsTotalPages = Math.ceil(myEvents.length / MY_EVENTS_PAGE_SIZE);
  const visibleMyEvents = myEvents.slice((myEventsPage - 1) * MY_EVENTS_PAGE_SIZE, myEventsPage * MY_EVENTS_PAGE_SIZE);

  const activePublications = myEvents.filter(e => e.imageUrl);

  const tabs: { key: Tab; label: string; icon: typeof Calendar; count?: number }[] = [
    { key: 'myevents', label: 'Mis Eventos', icon: Calendar, count: myEvents.length },
    { key: 'registered', label: 'Publicaciones activas', icon: PlayCircle, count: activePublications.length },
    { key: 'instagram', label: 'Instagram', icon: Camera, count: instagramPosts.filter(p => !!p.media_url).length },
  ];

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#F8FAFC' }}>

      {/* Subnav sticky — justo debajo del navbar principal */}
      <div className="sticky top-16 z-40 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-14">
          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                style={
                  tab === key
                    ? { backgroundColor: '#EFF6FF', color: '#2563EB' }
                    : { color: '#1D1D1F99', backgroundColor: 'transparent' }
                }
              >
                <Icon className="w-4 h-4" />
                {label}
                {count !== undefined && count > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={
                      tab === key
                        ? { backgroundColor: '#DBEAFE', color: '#2563EB' }
                        : { backgroundColor: '#E4EBFA', color: '#1D1D1F66' }
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Tab: Instagram */}
      {tab === 'instagram' && (
        <>
          {/* Buscador */}
          <div className="max-w-4xl mx-auto px-4 pt-6">
            {instagramUsername && (
              <div className="flex items-center gap-2 mb-4">
                {instagramAvatar && (
                  <img src={instagramAvatar} alt="" className="w-6 h-6 rounded-full" />
                )}
                <span className="text-sm" style={{ color: '#1D1D1F99' }}>@{instagramUsername}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#1D1D1F66' }} />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setPostPage(1); }}
                  placeholder="Buscar en captions..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm light-form"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoadingPosts(true);
                  socialApi.getUserMedia()
                    .then(({ data }) => setInstagramPosts(data))
                    .catch(() => {})
                    .finally(() => setLoadingPosts(false));
                }}
                disabled={loadingPosts}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: '#FCE7F3', border: '1px solid #FBCFE8', color: '#BE185D' }}
              >
                <RefreshCw className={`w-4 h-4 ${loadingPosts ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>

          {/* Grid de cards — max-w-7xl */}
          <div className="max-w-7xl mx-auto px-4 pb-20">
            {loadingPosts ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#2563EB', borderTopColor: 'transparent' }} />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-2xl p-16 text-center border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}>
                <Camera className="w-12 h-12 mx-auto mb-4" style={{ color: '#1D1D1F33' }} />
                <p className="text-sm" style={{ color: '#1D1D1F99' }}>
                  {filter ? 'No hay publicaciones que coincidan con tu búsqueda' : 'Aún no hay publicaciones en Instagram'}
                </p>
                {!instagramConnected && (
                  <button
                    type="button"
                    onClick={handleInstagramLink}
                    className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#2563EB' }}
                  >
                    Vincular Instagram
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {visiblePosts.map((post) => (
                    <InstagramPostPublisher
                      key={post.id}
                      post={post}
                      onPublished={() => {
                        socialApi.getUserMedia().then(({ data }) => setInstagramPosts(data)).catch(() => {});
                        loadUser();
                      }}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={postPage}
                  totalPages={postTotalPages}
                  onPageChange={setPostPage}
                />
              </>
            )}
          </div>
        </>
      )}

      {/* Tab: Mis Eventos — max-w-7xl */}
      {tab === 'myevents' && (
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
          {/* Botón publicar — derecha, justo debajo del subnav */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Sparkles className="w-4 h-4" />
              Publicar nuevo evento
            </button>
          </div>

          {myEvents.length === 0 ? (
            <div className="rounded-2xl p-16 text-center border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E4EBFA' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#2563EB' }} />
              </div>
              <p className="text-sm mb-4" style={{ color: '#1D1D1F99' }}>No has publicado eventos aún</p>
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#2563EB' }}
              >
                Publicar mi primer evento
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {visibleMyEvents.map((event) => (
                  <div key={event.id} className="relative group">
                    <EventCard event={event} />
                    {instagramConnected && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await socialApi.syncFeed(event.id);
                            const { data } = await eventsApi.getByOwner();
                            setMyEvents(data);
                          } catch { /* noop */ }
                        }}
                        className="absolute top-2 right-2 p-2 rounded-lg border text-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA', color: '#2563EB' }}
                        title="Sincronizar Instagram"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={myEventsPage}
                totalPages={myEventsTotalPages}
                onPageChange={setMyEventsPage}
              />
            </>
          )}
        </div>
      )}

      {/* Tab: Publicaciones activas — max-w-4xl */}
      {tab === 'registered' && (
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
          {activePublications.length === 0 ? (
            <div className="rounded-2xl p-16 text-center border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E4EBFA' }}>
                <PlayCircle className="w-8 h-8" style={{ color: '#2563EB' }} />
              </div>
              <p className="text-sm" style={{ color: '#1D1D1F99' }}>No hay publicaciones activas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activePublications.map((event) => {
                const now = new Date();
                const endDate = event.publicationEndDate ? new Date(event.publicationEndDate) : null;
                const isActive = !endDate || endDate >= now;
                return (
                  <PublishedEventCard key={`${event.id}-${event.updatedAt || event.title}`} event={event} isActive={isActive} onUpdate={loadUser} />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal crear evento */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setCreateModalOpen(false)}
          />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between p-4 border-b"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}
            >
              <h2 className="text-lg font-semibold" style={{ color: '#1D1D1F' }}>Publicar Evento</h2>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-2 rounded-lg border cursor-pointer transition-colors"
                style={{ borderColor: '#E4EBFA', color: '#1D1D1F99' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <CreateEventForm
                showHeader={false}
                onSuccess={() => { setCreateModalOpen(false); loadUser(); }}
                onCancel={() => setCreateModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CATEGORIES = ['Música', 'Cultura', 'Gastronomía', 'Turismo', 'Trekking', 'Deportes', 'Ferias', 'Bienestar', 'Fiestas', 'Documental'];
const EVENT_TYPES = [
  { value: 'gratis', label: 'Gratis' },
  { value: 'compra', label: 'Compra tu entrada' },
  { value: 'cupo', label: 'Asegura tu cupo' },
];

function parseDescParts(desc: string) {
  const idx = desc.indexOf('\n');
  if (idx === -1) return { subtitle: '', descText: desc };
  return { subtitle: desc.slice(0, idx).trim(), descText: desc.slice(idx + 1).trim() };
}

function PublishedEventCard({ event, isActive, onUpdate }: { event: Event; isActive: boolean; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const parts = parseDescParts(event.description || '');
  const [title, setTitle] = useState(event.title);
  const [subtitle, setSubtitle] = useState(parts.subtitle);
  const [descText, setDescText] = useState(parts.descText);
  const [eventDate, setEventDate] = useState(format(new Date(event.date), 'yyyy-MM-dd'));
  const [eventTime, setEventTime] = useState(format(new Date(event.date), 'HH:mm'));
  const [comuna, setComuna] = useState(event.city || '');
  const [tipo, setTipo] = useState(event.address && event.address.startsWith('http') ? 'compra' : 'gratis');
  const [category, setCategory] = useState(event.category?.name || '');
  const [startDate, setStartDate] = useState(
    event.publicationStartDate ? format(new Date(event.publicationStartDate), "yyyy-MM-dd'T'HH:mm") : ''
  );
  const [endDate, setEndDate] = useState(
    event.publicationEndDate ? format(new Date(event.publicationEndDate), "yyyy-MM-dd'T'HH:mm") : ''
  );

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const description = [subtitle.trim(), descText.trim()].filter(Boolean).join('\n') || event.description;
      await eventsApi.update(event.id, {
        title: title.trim(),
        description,
        date: new Date(`${eventDate}T${eventTime}`).toISOString(),
        city: comuna,
        categoryName: category || undefined,
        publicationStartDate: startDate ? new Date(startDate).toISOString() : undefined,
        publicationEndDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      setEditing(false);
      clearCache();
      onUpdate();
    } catch { /* noop */ } finally { setLoading(false); }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await eventsApi.update(event.id, { publicationEndDate: new Date().toISOString() });
      clearCache();
      onUpdate();
    } catch { /* noop */ } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta publicación de la web?')) return;
    setLoading(true);
    try {
      await eventsApi.delete(event.id);
      clearCache();
      onUpdate();
    } catch { /* noop */ } finally { setLoading(false); }
  };

  if (editing) {
    return (
      <div className="rounded-xl p-4 border space-y-3" style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>Editar publicación</p>
          <button type="button" onClick={() => setEditing(false)} className="p-1 cursor-pointer" style={{ color: '#1D1D1F99' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Título</p>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 45))} className="w-full px-3 py-1.5 rounded-lg text-xs light-form" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Subtítulo</p>
            <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value.slice(0, 90))} rows={4} className="w-full px-3 py-1.5 rounded-lg text-xs light-form resize-none overflow-hidden" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Texto descriptivo</p>
            <textarea value={descText} onChange={(e) => setDescText(e.target.value.slice(0, 300))} rows={10} className="w-full px-3 py-1.5 rounded-lg text-xs light-form resize-none overflow-hidden" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Fecha evento</p>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-3 py-1.5 rounded-lg text-xs light-form" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Hora</p>
            <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full px-3 py-1.5 rounded-lg text-xs light-form" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Comuna</p>
            <select value={comuna} onChange={(e) => setComuna(e.target.value)} className="w-full px-3 py-1.5 rounded-lg text-xs light-form">
              <option value="" disabled>Selecciona comuna</option>
              {COMUNAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Tipo</p>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-3 py-1.5 rounded-lg text-xs light-form">
              {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Categoría</p>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-1.5 rounded-lg text-xs light-form">
              <option value="" disabled>Selecciona categoría</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Inicio publicación</p>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-1.5 rounded-lg text-xs light-form" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#1D1D1F99' }}>Fin publicación</p>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-1.5 rounded-lg text-xs light-form" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => setEditing(false)} className="px-4 py-1.5 rounded-lg text-xs border cursor-pointer" style={{ borderColor: '#E4EBFA', color: '#1D1D1F99' }}>
            Cancelar
          </button>
          <button type="button" onClick={handleUpdate} disabled={loading} className="px-4 py-1.5 rounded-lg text-xs text-white cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#2563EB' }}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-3 flex items-center gap-3 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}>
      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden">
        {event.imageUrl && <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#1D1D1F' }}>{event.title}</p>
        <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: isActive ? '#16A34A' : '#DC2626' }}>
          <Clock className="w-3 h-3" />
          {isActive ? 'Publicado' : 'Detenido'}
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: '#1D1D1F66' }}>
          {event.publicationStartDate ? format(new Date(event.publicationStartDate), "d MMM HH:mm", { locale: es }) : '—'}
          {' → '}
          {event.publicationEndDate ? format(new Date(event.publicationEndDate), "d MMM HH:mm", { locale: es }) : '—'}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button type="button" onClick={() => setEditing(true)} className="p-1.5 rounded-lg border cursor-pointer" style={{ borderColor: '#E4EBFA', color: '#2563EB' }} title="Editar">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        {isActive ? (
          <button type="button" onClick={handleStop} disabled={loading} className="p-1.5 rounded-lg border cursor-pointer" style={{ borderColor: '#E4EBFA', color: '#DC2626' }} title="Detener">
            <PauseCircle className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button type="button" onClick={() => setEditing(true)} className="p-1.5 rounded-lg border cursor-pointer" style={{ borderColor: '#E4EBFA', color: '#16A34A' }} title="Reanudar">
            <PlayCircle className="w-3.5 h-3.5" />
          </button>
        )}
        <button type="button" onClick={handleDelete} disabled={loading} className="p-1.5 rounded-lg border cursor-pointer" style={{ borderColor: '#E4EBFA', color: '#DC2626' }} title="Eliminar">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
