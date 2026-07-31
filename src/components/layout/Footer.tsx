import Link from 'next/link';

const LINKS = {
  Explore: [
    { label: 'Browse Properties', href: '/properties' },
    { label: 'Apartments', href: '/properties?category=Apartment' },
    { label: 'Houses', href: '/properties?category=House' },
    { label: 'Studios', href: '/properties?category=Studio' },
  ],
  Account: [
    { label: 'Login', href: '/auth/login' },
    { label: 'Register', href: '/auth/register' },
    { label: 'Tenant Dashboard', href: '/dashboard/tenant' },
    { label: 'Landlord Dashboard', href: '/dashboard/landlord' },
  ],
  Company: [
    { label: 'About RentNest', href: '/' },
    { label: 'List Your Property', href: '/auth/register' },
    { label: 'Contact Us', href: '/' },
    { label: 'Privacy Policy', href: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏠</span>
              <span className="text-white font-bold text-xl">RentNest</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Find & list rental properties with ease. Connecting tenants and landlords across Bangladesh.
            </p>
            <div className="flex gap-3 mt-5">
              {['🐦', '📘', '📸', '▶️'].map((icon, i) => (
                <span key={i} className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors">
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <p>Made with ❤️ for renters across Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
