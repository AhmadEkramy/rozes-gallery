import heroImage from '@/assets/hero-gallery.jpg';
import ProductCard from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/cart';
import { useLanguage } from '@/contexts/language-hooks';
import { usePublicProducts } from '@/hooks/usePublicProducts';
import { useSpecialOffers } from '@/hooks/useSpecialOffers';
import { ArrowRight, Crown, Loader2, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



const Home = () => {
  const { products, loading: loadingProducts, error: productsError } = usePublicProducts();
  const { offers: specialOffers, loading: loadingOffers, error: offersError } = useSpecialOffers();
  const { addToCart } = useCart();
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    if (specialOffers && specialOffers.length > 0) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prevIndex) => 
          prevIndex === specialOffers.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [specialOffers]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt="Rozes Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-glow-secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('touchOfWard')}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('welcomeTo')}{' '}
              <span className="bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                {t('rozesGallery')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="bg-white text-primary hover:bg-white/90 shadow-luxury hover:shadow-glow-intense transition-all duration-300 font-semibold px-8"
              >
                <Link to="/products">
                  {t('exploreCollection')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm font-semibold px-8"
              >
                <a href="#about">
                  {t('ourStory')}
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
          <Crown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Special Offers Banner */}
      {specialOffers && specialOffers.length > 0 && (
        <section className="py-4 bg-gradient-primary text-white overflow-hidden">
          <div className="container mx-auto px-4">
            {loadingOffers ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Loading offers...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4 animate-fade-in">
                <Star className="h-5 w-5 animate-glow-pulse" />
                <div className="text-center">
                  <span className="text-lg font-semibold">
                    {specialOffers[currentOfferIndex].title}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-white/90">
                    {specialOffers[currentOfferIndex].description}
                  </span>
                </div>
                <Star className="h-5 w-5 animate-glow-pulse" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-gradient-secondary text-foreground border-0">
              {t('latestCollection')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Our{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('products')}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('featuredDescription')}
            </p>
          </div>
          
          {loadingProducts ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <div className="text-muted-foreground">Loading products...</div>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <div className="text-destructive text-lg mb-4">{productsError}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {products.slice(0, 8).map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button 
              size="lg" 
              asChild
              className="bg-gradient-primary hover:bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-intense transition-all duration-300 border-0 px-8"
            >
              <Link to="/products">
                {t('viewAllProducts')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Offers Grid Section */}
      {specialOffers && specialOffers.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-primary/5 bg-fixed" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <Badge className="mb-4 bg-gradient-primary text-white border-0 shadow-glow-primary">
                {t('specialOffers')}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Special{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Offers
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('offersDescription')}
              </p>
            </div>
            
            {loadingOffers ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <div className="text-muted-foreground">Loading offers...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specialOffers.map((offer, index) => {
                  const daysRemaining = Math.ceil(
                    (new Date(offer.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = daysRemaining <= 3;

                  return (
                    <Card 
                      key={offer.id}
                      className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                        isUrgent ? 'ring-2 ring-destructive ring-offset-2 ring-offset-background' : ''
                      } hover:shadow-glow-intense`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={offer.image || '/placeholder.svg'}
                            alt={offer.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                          <Badge 
                            className={`absolute top-3 right-3 ${
                              isUrgent 
                                ? 'bg-destructive animate-pulse' 
                                : 'bg-gradient-primary'
                            } text-white border-0 shadow-glow-primary`}
                          >
                            {offer.type === 'percentage' ? `${offer.discount}%` : `$${offer.discount}`} OFF
                          </Badge>
                        </div>
                        
                        {/* Products in Offer */}
                        <div className="px-6 flex gap-2 overflow-x-auto pb-2">
                          {products.filter(product => offer.products.includes(product.id)).map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-20 h-20 relative group/product">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                <p className="text-white text-xs text-center px-1">{product.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <CardContent className="relative p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                            {offer.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {offer.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className={`text-sm ${
                            isUrgent ? 'text-destructive font-medium' : 'text-muted-foreground'
                          }`}>
                            {isUrgent ? (
                              <span className="flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-destructive rounded-full animate-pulse" />
                                Ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}!
                              </span>
                            ) : (
                              `Valid until ${new Date(offer.endDate).toLocaleDateString()}`
                            )}
                          </div>
                          <Button 
                            onClick={() => {
                              const productsInOffer = products.filter(p => offer.products.includes(p.id));
                              productsInOffer.forEach(product => {
                                // Calculate discounted price based on offer type
                                const discountedPrice = offer.type === 'percentage' 
                                  ? product.price * (1 - offer.discount / 100)
                                  : Math.max(product.price - offer.discount, 0);

                                // Add to cart with the original price and discounted price
                                addToCart({
                                  ...product,
                                  originalPrice: product.price,
                                  price: discountedPrice,
                                });
                              });
                            }}
                            size="sm"
                            className="bg-gradient-primary hover:bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-intense transition-all duration-300 border-0"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            {t('addToCart')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-primary text-white border-0 shadow-glow-primary">
              {t('aboutRozesGallery')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Story
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('aboutDescription')}
            </p>
          </div>

          {/* About Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Touch of{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Ward
                </span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('touchOfWardDescription1')}
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('touchOfWardDescription2')}
              </p>
            </div>
            <div className="relative">
              <img 
                src="/ourstory.png" 
                alt="Our Story" 
                className="w-full h-full object-cover rounded-2xl shadow-luxury animate-float"
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Our{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Values
                </span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('valuesDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Crown,
                  title: t('luxury'),
                  description: t('luxuryDescription'),
                },
                {
                  icon: Star,
                  title: t('excellence'),
                  description: t('excellenceDescription'),
                },
                {
                  icon: Sparkles,
                  title: t('innovation'),
                  description: t('innovationDescription'),
                },
                {
                  icon: Crown,
                  title: t('trust'),
                  description: t('trustDescription'),
                },
              ].map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card 
                    key={index}
                    className="group text-center hover:shadow-glow-secondary transition-all duration-500 hover:-translate-y-2 border-border/50"
                  >
                    <CardContent className="p-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6 shadow-glow-primary group-hover:shadow-glow-intense transition-all duration-300">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                        {value.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-primary rounded-3xl p-12 text-white text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {t('ourJourneyInNumbers')}
            </h3>
            <p className="text-white/90 text-lg mb-12">
              {t('celebratingMilestones')}
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '10K+', label: t('happyCustomers') },
                { number: '500+', label: t('premiumProducts') },
                { number: '5 Years', label: t('experience') },
                { number: '99%', label: t('satisfactionRate') },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2 animate-glow-pulse">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-primary text-white border-0 shadow-glow-primary">
              {t('getInTouch')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Contact{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Us
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('contactDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {[
                {
                  icon: ArrowRight,
                  title: t('phone'),
                  details: t('phoneNumber'),
                  description: t('phoneHours'),
                },
                {
                  icon: Star,
                  title: t('email'),
                  details: t('emailAddress'),
                  description: t('emailResponse'),
                },
                {
                  icon: Crown,
                  title: t('location'),
                  details: t('address'),
                  description: t('addressDetails'),
                },
                {
                  icon: Sparkles,
                  title: t('businessHours'),
                  details: t('hours'),
                  description: t('hoursDetails'),
                },
              ].map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card 
                    key={index}
                    className="group hover:shadow-glow-secondary transition-all duration-300 border-border/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg shadow-glow-primary group-hover:shadow-glow-intense transition-all duration-300 flex-shrink-0">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {info.title}
                          </h3>
                          <p className="text-foreground font-medium">
                            {info.details}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-luxury border-border/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    {t('sendMessage')}
                  </h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          {t('name')} *
                        </label>
                        <input
                          type="text"
                          placeholder={t('namePlaceholder')}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-background text-foreground"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          {t('email')} *
                        </label>
                        <input
                          type="email"
                          placeholder={t('emailPlaceholder')}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-background text-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                                                  {t('subject')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('subjectPlaceholder')}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        Message *
                      </label>
                      <textarea
                        placeholder={t('messagePlaceholder')}
                        rows={6}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none bg-background text-foreground"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-primary hover:bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-intense transition-all duration-300 border-0"
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      {t('sendMessageBtn')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;