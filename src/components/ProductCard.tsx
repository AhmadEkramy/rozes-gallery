import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/cart';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Product } from '@/hooks/usePublicProducts';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
      duration: 2000,
    });
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };
  
  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-500 hover:shadow-glow-intense hover:-translate-y-2 bg-card border-border/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          {/* Product Image */}
          <img 
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-primary/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isOffer && product.discountPercent && (
              <Badge className="bg-gradient-primary text-white border-0 shadow-glow-primary animate-glow-pulse">
                -{product.discountPercent}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="shadow-elegant">
                Out of Stock
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleToggleFavorite}
              className={`h-8 w-8 shadow-elegant hover:shadow-glow-secondary transition-all duration-300 ${isFavorited ? 'bg-gradient-primary text-white hover:bg-gradient-primary' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/products/${product.id}`;
              }}
              className="h-8 w-8 shadow-elegant hover:shadow-glow-secondary transition-all duration-300"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Add to Cart */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-gradient-primary hover:bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-intense transition-all duration-300 border-0"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {product.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="text-primary hover:text-primary hover:bg-primary/10 gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;