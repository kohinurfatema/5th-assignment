import Link from 'next/link';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import { MapPin, Bed, Bath, ArrowRight } from 'lucide-react';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center">
              <span className="text-7xl opacity-30">🏠</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Status badge */}
          <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
            property.status === 'AVAILABLE' ? 'bg-green-500/90 text-white' :
            property.status === 'RENTED' ? 'bg-red-500/90 text-white' :
            'bg-gray-500/90 text-white'
          }`}>
            {property.status}
          </span>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-bold text-lg leading-none">
              {formatPrice(property.pricePerMonth)}
              <span className="text-white/70 text-xs font-normal">/mo</span>
            </p>
          </div>

          {/* Category badge */}
          {property.category?.name && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 bg-white/90 backdrop-blur-sm text-blue-700 rounded-full">
              {property.category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate text-base group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1.5">
            <MapPin size={13} className="text-blue-400 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Bed size={14} className="text-blue-400" />{property.bedrooms} bed</span>
              <span className="flex items-center gap-1"><Bath size={14} className="text-blue-400" />{property.bathrooms} bath</span>
            </div>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
