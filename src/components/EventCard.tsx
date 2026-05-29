import { Link } from 'react-router-dom';
import { Calendar, MapPin, Globe, Users, Camera } from 'lucide-react';
import type { Event } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  event: Event;
  featured?: boolean;
}

const categoryGradients: Record<string, string> = {
  'Música': 'from-violet-600 to-purple-600',
  'Turismo': 'from-emerald-600 to-teal-600',
  'Arte': 'from-pink-600 to-rose-600',
  'Gastronomía': 'from-orange-600 to-amber-600',
  'Deportes': 'from-blue-600 to-cyan-600',
};

export default function EventCard({ event, featured }: Props) {
  const gradient = categoryGradients[event.category?.name || ''] || 'from-gray-600 to-slate-600';

  return (
    <Link
      to={`/events/${event.slug}`}
      className={`group block relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
        featured ? 'glow-cyan' : 'glass hover:glow-purple'
      }`}
    >
      {event.imageUrl && (
        <div className="h-36 overflow-hidden">
          <img
            src={event.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} ${event.imageUrl ? 'opacity-40' : 'opacity-20'} group-hover:opacity-30 transition-opacity`} />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`font-bold tracking-tight text-white group-hover:text-gradient transition-all ${
              featured ? 'text-2xl' : 'text-lg'
            }`}>
              {event.title}
            </h3>
            {event.category && (
              <span className="inline-block mt-2 text-xs font-medium text-neon-cyan bg-white/5 px-2 py-1 rounded-full">
                {event.category.name}
              </span>
            )}
          </div>
          {event.isOnline && (
            <Globe className="w-5 h-5 text-neon-cyan shrink-0" />
          )}
        </div>

        <p className={`text-gray-400 mb-4 line-clamp-2 ${featured ? 'text-base' : 'text-sm'}`}>
          {event.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-neon-cyan" />
            <span>{format(new Date(event.date), "d 'de' MMMM, yyyy • HH:mm", { locale: es })}</span>
          </div>
          {event.locationName && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4 text-neon-purple" />
              <span>{event.locationName}{event.city ? `, ${event.city}` : ''}</span>
            </div>
          )}
        </div>

        {event.socialFeed && event.socialFeed.length > 0 && (
          <div className="mt-3 flex gap-1 overflow-x-auto">
            {event.socialFeed.slice(0, 3).map((post, i) => (
              <div key={i} className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                {post.media_url ? (
                  <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-pink-400/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-[10px] font-bold text-white">
              {event.owner?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-500">{event.owner?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {event.socialFeed && event.socialFeed.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-pink-400" title="Publicaciones de Instagram">
                <Camera className="w-3 h-3" />
                {event.socialFeed.length}
              </span>
            )}
            {event.attendees && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                {event.attendees.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
