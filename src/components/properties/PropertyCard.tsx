import Link from 'next/link';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import { MapPin, Bed, Bath } from 'lucide-react';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <span className="text-6xl opacity-40">🏠</span>
          )}
          <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${
            property.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
            property.status === 'RENTED' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">{property.category?.name}</p>
          <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin size={13} />
            <span className="truncate">{property.location}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Bed size={14} />{property.bedrooms} bed</span>
            <span className="flex items-center gap-1"><Bath size={14} />{property.bathrooms} bath</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-blue-600 font-bold">{formatPrice(property.pricePerMonth)}<span className="text-gray-400 text-xs font-normal">/mo</span></p>
            <span className="text-xs text-gray-500">by {property.landlord?.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
