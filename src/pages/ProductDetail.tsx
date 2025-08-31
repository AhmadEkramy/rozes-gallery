import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/cart';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, Heart, Loader2, Share2, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface ProductType {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string; // For backwards compatibility
  images: string[];
  inStock: boolean;
  stock: number;
  rating?: number;
  reviewCount?: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  features?: string[];
  specifications?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const productRef = doc(db, 'products', id);
        const productDoc = await getDoc(productRef);
        
        if (!productDoc.exists()) {
          setError('Product not found');
          toast({
            variant: "destructive",
            title: "Error",
            description: "Product not found"
          });
          navigate('/products');
          return;
        }

        const data = productDoc.data();
        const productData: ProductType = {
          id: productDoc.id,
          title: data.title,
          price: data.price,
          originalPrice: data.originalPrice,
          category: data.category,
          description: data.description,
          image: data.image || '',
          images: data.images || [data.image], // Support both arrays and single image
          inStock: data.stock > 0,
          stock: data.stock,
          rating: data.rating,
          reviewCount: data.reviewCount,
          discount: data.discount,
          features: data.features,
          specifications: data.specifications,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };

        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || product.image,
      category: product.category,
      description: product.description,
      stock: product.stock,
      inStock: product.inStock,
      status: product.stock > 10 ? 'active' : 'low_stock'
    }, quantity);

    toast({
      title: "Success",
      description: `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`
    });

    toast({
      title: "Success",
      description: `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <div className="text-muted-foreground">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg mb-4">{error}</div>
          <Button asChild variant="outline">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="max-w-md mx-auto aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index 
                      ? 'border-primary shadow-glow-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-gradient-secondary text-foreground border-0">
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {product.title}
              </h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} {product.reviewCount && `(${product.reviewCount} reviews)`}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-gradient-primary text-white border-0 shadow-glow-primary">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-gradient-primary rounded-full mr-3 shadow-glow-primary"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
              </>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 hover:bg-accent"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 hover:bg-accent"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-primary hover:bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-intense transition-all duration-300 border-0"
                  size="lg"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`hover:bg-accent hover:shadow-glow-secondary transition-all duration-300 ${
                    isFavorited ? 'bg-gradient-primary text-white border-0 shadow-glow-primary' : ''
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-b-0">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;