import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi, categoriesApi } from '../../api';
import type { Category } from '../../types';
import { COMUNAS } from '../../constants/comunas';
import {
  Sparkles,
  Calendar,
  MapPin,
  Globe,
  Image,
  Send,
} from 'lucide-react';
import { format } from 'date-fns';

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showHeader?: boolean;
}

export default function CreateEventForm({ onSuccess, onCancel, showHeader = true }: CreateEventFormProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    locationName: '',
    address: '',
    city: '',
    isOnline: false,
    imageUrl: '',
    categoryId: '',
  });

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await eventsApi.create(form);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/events/${data.slug}`);
      }
    } catch {
      setError('Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showHeader && (
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
            Publicar Evento
          </h1>
          <p className="text-gray-400 mt-2">
            Comparte tu evento con la comunidad
          </p>
        </div>
      )}

      <div className="glass rounded-2xl p-8 glow-purple">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Título del Evento
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              placeholder="Ej: Concierto de Rock en Pucón"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              placeholder="Describe tu evento, artistas, actividades..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neon-cyan" />
                  Fecha y Hora
                </div>
              </label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Categoría
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neon-purple" />
                  Lugar
                </div>
              </label>
              <input
                type="text"
                name="locationName"
                value={form.locationName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                placeholder="Ej: Teatro Municipal"
              />
            </div>

            <div>
              <label htmlFor="comuna" className="block text-sm font-medium text-gray-300 mb-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neon-pink" />
                  Comuna
                </div>
              </label>
              <select
                id="comuna"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
              >
                <option value="">Selecciona una comuna</option>
                {COMUNAS.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              placeholder="Dirección del evento"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-neon-cyan" />
                  URL de Imagen
                </div>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isOnline"
                    checked={form.isOnline}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 rounded-full bg-dark-600 peer-checked:bg-gradient-to-r peer-checked:from-neon-cyan peer-checked:to-neon-purple transition-all" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white peer-checked:translate-x-4 transition-transform" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Globe className="w-4 h-4" />
                  Evento Online
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl glass text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer ${
                onCancel ? 'flex-1' : 'w-full'
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Publicando...' : 'Publicar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
