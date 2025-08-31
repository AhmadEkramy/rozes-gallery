import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-hooks';
import { Facebook, Instagram, MessageCircle, Music } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/share/1a9hZWGiH6/',
      color: 'hover:text-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
    },
    {
      name: 'Instagram', 
      icon: Instagram,
      url: 'https://www.instagram.com/rozes_by_rg/',
      color: 'hover:text-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]'
    },
    {
      name: 'TikTok',
      icon: Music,
      url: 'https://www.tiktok.com/@rozes_by_rg?_t=ZS-8zBBj5ZftXm&_r=1',
      color: 'hover:text-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://wa.me/01515695312',
      color: 'hover:text-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]'
    },
  ];

  const quickLinks = [
    { name: t('home'), href: '/' },
    { name: t('products'), href: '/products' },
    { name: t('about'), href: '#about' },
    { name: t('contact'), href: '#contact' },
  ];

  const customerServiceLinks = [
    { name: t('shipping'), href: '#' },
    { name: t('privacyPolicy'), href: '#' },
    { name: t('termsOfService'), href: '#' },
    { name: t('customerService'), href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-br from-background via-muted/20 to-background border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Rozes Gallery" className="h-12 w-auto" />
                <p className="text-sm text-muted-foreground italic">
                  {t('touchOfWard')}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('aboutDescription')}
            </p>
            
            {/* Social Media Icons */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">{t('followUs')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('stayConnected')}
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="ghost" 
                      size="sm"
                      asChild
                      className={`group relative p-3 rounded-full border border-border/50 hover:border-primary/50 transition-all duration-300 ${social.color} hover:scale-110`}
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                      >
                        <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block relative group"
                    onClick={link.href.startsWith('#') ? (e) => {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    } : undefined}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">{t('customerService')}</h4>
            <ul className="space-y-3">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">{t('getInTouch')}</h4>
            <div className="space-y-4">
              <div className="group">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {t('phone')}
                </p>
                <p className="text-muted-foreground">{t('phoneNumber')}</p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {t('email')}
                </p>
                <p className="text-muted-foreground">{t('emailAddress')}</p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {t('location')}
                </p>
                <p className="text-muted-foreground">
                  {t('address')}<br />
                  {t('addressDetails')}
                </p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {t('businessHours')}
                </p>
                <p className="text-muted-foreground">{t('phoneHours')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 {t('rozesGallery')}. {t('allRightsReserved')}
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
              <p className="text-sm text-muted-foreground italic">
                {t('touchOfWard')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;