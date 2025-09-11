import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Instagram, Youtube, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

interface SiteSetting {
  id: number;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

export default function Footer() {
  const [location, setLocation] = useLocation();

  const { data: settings = [] } = useQuery<SiteSetting[]>({
    queryKey: ['/api/settings'],
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

  // Don't show footer on complete-profile page
  if (location === '/complete-profile') {
    return null;
  }

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const footerSections = [
    {
      title: 'Marketplace',
      links: [
        { name: 'Explorar Produtos', href: '/' },
        { name: 'Categorias', href: '/categories' },
        { name: 'Criadores', href: '/creators' },
        { name: 'Novidades', href: '/new' },
      ],
    },
    {
      title: 'Suporte',
      links: [
        { name: 'Central de Ajuda', href: '/help' },
        { name: 'Como Comprar', href: '/how-to-buy' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contato', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Termos de Uso', action: () => window.dispatchEvent(new CustomEvent('show-terms-modal')) },
        { name: 'Privacidade', action: () => window.dispatchEvent(new CustomEvent('show-privacy-modal')) },
        { name: 'Política de Reembolso', href: '/refund-policy' },
        { name: 'Direitos Autorais', href: '/copyright' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Discord', icon: MessageCircle, href: getSetting('social_discord') || '#' },
    { name: 'Instagram', icon: Instagram, href: getSetting('social_instagram') || '#' },
    { name: 'YouTube', icon: Youtube, href: getSetting('social_youtube') || '#' },
    { name: 'LinkedIn', icon: Linkedin, href: getSetting('social_linkedin') || '#' },
  ];

  return (
    <footer className="bg-gradient-to-b from-dark-safe to-gray-900 border-t border-gray-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section - Takes more space */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.imgur.com/5OKEMhN.png" 
                alt="MineCart Store" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-2xl font-bold text-white">MineCart Store</span>
            </div>
            <p className="text-light-safe text-sm leading-relaxed max-w-md">
              O marketplace mais completo para conteúdo de Minecraft. Milhares de skins, mapas, mods e recursos criados pela comunidade para você.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-light-safe">
                <Mail className="w-4 h-4 mr-2 text-accent-yellow" />
                <span>suporte@minecartstore.com</span>
              </div>
              <div className="flex items-center text-sm text-light-safe">
                <MapPin className="w-4 h-4 mr-2 text-accent-yellow" />
                <span>Brasil, São Paulo</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wide">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <span 
                      onClick={() => {
                        if ('action' in link && link.action) {
                          link.action();
                        } else if ('href' in link && link.href) {
                          setLocation(link.href);
                        }
                      }}
                      className="text-light-safe hover:text-accent-yellow transition-colors cursor-pointer text-sm block hover:translate-x-1 transform transition-transform duration-200"
                    >
                      {link.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-xs text-gray-400">
                © 2024 MineCart Store. Todos os direitos reservados.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400 hidden md:block">Siga-nos:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-800 hover:bg-primary-orange rounded-full flex items-center justify-center transition-colors group"
                    title={social.name}
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>

            {/* Made with love */}
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">
                Feito com <span className="text-red-500">❤️</span> para a comunidade Minecraft
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}