import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Twitter, Youtube, Linkedin } from 'lucide-react';

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
      title: 'Empresa',
      links: [
        { name: 'Sobre Nós', href: '/about' },
        { name: 'Contato', href: '/contact' },
        { name: 'Carreiras', href: '/careers' },
        { name: 'Blogue', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Política de Privacidade', action: () => window.dispatchEvent(new CustomEvent('show-privacy-modal')) },
        { name: 'Termos de Serviço', action: () => window.dispatchEvent(new CustomEvent('show-terms-modal')) },
        { name: 'Termos de Venda', href: '/sales-terms' },
        { name: 'Licenças', href: '/licenses' },
      ],
    },
    {
      title: 'Suporte',
      links: [
        { name: 'Central de Ajuda', href: '/help' },
        { name: 'Perguntas Frequentes', href: '/faq' },
        { name: 'Contato Suporte', href: '/contact' },
        { name: 'Status do Sistema', href: '/status' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Discord', icon: MessageCircle, href: getSetting('social_discord') },
    { name: 'Gorjeto', icon: Twitter, href: getSetting('social_twitter') },
    { name: 'YouTube', icon: Youtube, href: getSetting('social_youtube') },
    { name: 'Linkedin', icon: Linkedin, href: getSetting('social_linkedin') },
  ];

  return (
    <footer className="border-t header-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="logo-container">
              <img 
                src="https://i.imgur.com/5OKEMhN.png" 
                alt="MineCart Store" 
                className="logo-image"
              />
              <span className="logo-text">MineCart Store</span>
            </div>
            <p className="text-sm text-light-safe opacity-80">
              O melhor marketplace para conteúdo de Minecraft. Encontre skins, mapas, mods e muito mais!
            </p>
          </div>

          {/* Company Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-lg mb-4 text-primary">{section.title}</h4>
              <ul className="space-y-2">
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
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer block"
                    >
                      {link.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary">Redes Sociais</h4>
            <ul className="space-y-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.name}>
                    <a 
                      href={social.href}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {social.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-600 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-light-safe opacity-70">
              © 2024 MineCart Store. Todos os direitos reservados.
            </p>
            <p className="text-xs text-light-safe opacity-70 mt-2 sm:mt-0">
              Feito com <span className="text-accent-yellow">❤️</span> para a comunidade Minecraft
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}