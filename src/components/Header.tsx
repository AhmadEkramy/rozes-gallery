import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart';
import { useLanguage } from '@/contexts/language-hooks';
import { Globe, LayoutDashboard, Menu, Moon, ShoppingCart, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  
  const { cartCount: cartItemCount } = useCart();
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('products'), path: '/products' },
    { name: t('about'), type: 'scroll', target: 'about' },
    { name: t('contact'), type: 'scroll', target: 'contact' },
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/logo.png" alt="Rozes Gallery" className="h-12 w-auto transform group-hover:scale-105 transition-transform duration-300" />
            <div className="hidden sm:block text-sm text-muted-foreground italic">
              {t('touchOfWard')}
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.type === 'scroll' ? (
                <button
                  key={item.name}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      window.location.href = '/#' + item.target;
                    } else {
                      const section = document.getElementById(item.target);
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-sm font-medium transition-all duration-300 hover:text-primary hover:shadow-glow-secondary text-foreground"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:shadow-glow-secondary ${
                    location.pathname === item.path 
                      ? 'text-primary shadow-glow-primary' 
                      : 'text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Dashboard */}
            <Link to="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-1 hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-xs font-medium">Admin</span>
              </Button>
            </Link>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center space-x-1 hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">{language}</span>
            </Button>
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-primary border-0 shadow-glow-primary"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                item.type === 'scroll' ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (location.pathname !== '/') {
                        window.location.href = '/#' + item.target;
                      } else {
                        const section = document.getElementById(item.target);
                        section?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-accent hover:shadow-glow-secondary rounded-md mx-2 text-foreground"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-accent hover:shadow-glow-secondary rounded-md mx-2 ${
                      location.pathname === item.path 
                        ? 'text-primary bg-accent shadow-glow-primary' 
                        : 'text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="flex items-center space-x-2 px-4 pt-2">
                {/* Admin Button in Mobile Menu */}
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="text-xs font-medium">Admin</span>
                  </Button>
                </Link>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1 hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">{language}</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;