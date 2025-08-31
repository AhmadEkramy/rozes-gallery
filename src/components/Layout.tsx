import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout = ({ children, showHeader = true, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {showHeader && <Header />}
      
      <main className="relative">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;