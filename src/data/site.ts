export const site = {
  name: 'Chemi-Core API',
  phone: '+92 326 0833256',
  phoneRaw: '+923260833256',
  whatsapp: 'https://wa.me/923260833256',
  email: 'info@chemicoreapi.com',
  wechat: 'wxid_pitpe48w9owi22',
  address: ['Office No. 1107, 11th Floor', 'Grand Square Mall, Gulberg III', 'Lahore, Pakistan'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Grand+Square+Mall+Gulberg+III+Lahore',
};

export const nav = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about/' },
  { key: 'services', label: 'Services', href: '/services/' },
  { key: 'mission', label: 'Mission', href: '/mission/' },
  { key: 'products', label: 'Products', href: '/products/' },
  { key: 'contact', label: 'Contact', href: '/contact/' },
] as const;

export type PageKey = (typeof nav)[number]['key'] | 'none';

// Headline figures shown in the stats band on the home page.
export const stats = [
  { value: 50, suffix: '+', label: 'Customers served', icon: 'clients' },
  { value: 300, suffix: '+', label: 'Products in our range', icon: 'flask' },
  { value: 40, suffix: '+', label: 'Supplier partners', icon: 'globe' },
];
