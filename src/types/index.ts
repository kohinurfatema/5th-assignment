export type Role = 'TENANT' | 'LANDLORD' | 'ADMIN';
export type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'UNAVAILABLE';
export type RentalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  isBanned: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  categoryId: string;
  landlordId: string;
  category: Category;
  landlord: Pick<User, 'id' | 'name' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  status: RentalStatus;
  moveInDate: string;
  message?: string;
  property: Property;
  tenant?: Pick<User, 'id' | 'name' | 'email'>;
  payment?: Payment;
  createdAt: string;
}

export interface Payment {
  id: string;
  rentalRequestId: string;
  amount: number;
  provider: 'STRIPE';
  stripeSessionId?: string;
  transactionId?: string;
  status: PaymentStatus;
  paidAt?: string;
  rentalRequest?: RentalRequest;
}

export interface Review {
  id: string;
  tenantId: string;
  propertyId: string;
  rating: number;
  comment: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  bedrooms?: number;
}
