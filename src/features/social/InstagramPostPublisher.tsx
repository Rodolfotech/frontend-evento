import { useState } from 'react';
import { Calendar, Tag, Send, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { eventsApi } from '../../api';
import type { SocialPost } from '../../types';

interface InstagramPostPublisherProps {
  post: SocialPost;
  onPublished?: () => void;
}

export function InstagramPostPublisher({ post, onPublished }: InstagramPostPublisherProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePublish = async () => {
    if (!startDate) {
      setError('La fecha de inicio es obligatoria');
      return;
    }
    if (!endDate) {
      setError('La fecha de término es obligatoria');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const title = post.caption
        ? post.caption.split('\n')[0].slice(0, 80)
        : 'Publicación de Instagram';
      await eventsApi.create({
        title,
        description: post.caption || title,
        date: new Date(startDate).toISOString(),
        publicationStartDate: new Date(startDate).toISOString(),
        publicationEndDate: new Date(endDate).toISOString(),
        categoryName: category || undefined,
        imageUrl: post.media_url || undefined,
        isOnline: true,
      });
      setSuccess(true);
      onPublished?.();
    } catch {
      setError('Error al publicar el evento');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass rounded-xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
          <Send className="w-5 h-5 text-green-400" />
        </div>
        <p className="text-sm text-green-400 font-medium">Evento publicado</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {post.media_url && (
        <div className="aspect-square overflow-hidden">
          <img
            src={post.media_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        {post.caption && (
          <p className="text-sm text-gray-400 line-clamp-2">{post.caption}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {format(new Date(post.timestamp), "dd MMM yyyy", { locale: es })}
          </span>
          {post.permalink && (
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-neon-cyan hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Instagram
            </a>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neon-cyan flex-shrink-0" />
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white"
              placeholder="Inicio publicación"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neon-pink flex-shrink-0" />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white"
              placeholder="Término publicación"
            />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-neon-purple flex-shrink-0" />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-gray-500"
              placeholder="Categoría (opcional)"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <button
          type="button"
          onClick={handlePublish}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </div>
  );
}
