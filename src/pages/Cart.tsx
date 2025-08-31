import { CheckoutForm, type CheckoutFormData } from '@/components/CheckoutForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/cart';
import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    increment,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { ArrowLeft, Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  expiryDate: string;
  minPurchase: number;
  isActive: boolean;
  description: string;
  usedCount: number;
}

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, loading, error, updateQuantity, removeFromCart } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const placeOrder = async (checkoutData: CheckoutFormData) => {
    try {
      const orderData = {
        customerName: checkoutData.name,
        email: checkoutData.email,
        phone: checkoutData.phone,
        shippingAddress: `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.zipCode}`,
        userId: user?.uid || null, // Set to null for guest users
        products: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        discount: discountAmount,
        shipping,
        tax,
        total,
        couponCode: activeCoupon?.code || null,
        status: 'pending' as const,
        orderDate: new Date().toISOString(),
      };

      // Create the order
      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      // If a coupon was used, update its usage count
      if (activeCoupon) {
        const couponRef = doc(db, 'coupons', activeCoupon.id);
        await updateDoc(couponRef, {
          usedCount: increment(1)
        });
      }

      // Clear the cart
      // Clear all items from cart one by one
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }
      
      // Double-check cart is cleared by setting empty state directly
      updateQuantity('', 0); // This triggers a cart update

      toast({
        title: "Order Placed!",
        description: "Thank you for your purchase. We'll email you the order details.",
      });

      // Reset states
      setPromoCode('');
      setDiscount(0);
      setActiveCoupon(null);
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    try {
      const couponsRef = collection(db, 'coupons');
      const q = query(
        couponsRef,
        where('code', '==', promoCode),
        where('isActive', '==', true),
        where('expiryDate', '>', new Date().toISOString())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast({
          title: "Invalid Coupon",
          description: "This coupon code is invalid or has expired",
          variant: "destructive"
        });
        setDiscount(0);
        setActiveCoupon(null);
        return;
      }

      const coupon = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as Coupon;

      // Check minimum purchase requirement
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        toast({
          title: "Cannot Apply Coupon",
          description: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`,
          variant: "destructive"
        });
        return;
      }

      // Check usage limit
      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        toast({
          title: "Coupon Expired",
          description: "This coupon has reached its usage limit",
          variant: "destructive"
        });
        return;
      }

      setDiscount(coupon.type === 'percentage' ? coupon.value / 100 : coupon.value / subtotal);
      setActiveCoupon(coupon);
      toast({
        title: "Success",
        description: `Coupon "${promoCode}" applied successfully!`
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive"
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <div className="text-muted-foreground">Loading cart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg mb-4">{error}</div>
          <Button asChild variant="outline">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Removed sign-in requirement check - allowing guest access

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-primary animate-float">
            <ShoppingBag className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Discover our beautiful collection and add some items to get started.
          </p>
          <Button 
            asChild
            className="bg-gradient-primary hover:bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-intense transition-all duration-300 border-0"
          >
            <Link to="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Shopping{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Cart
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-border/50 hover:shadow-glow-secondary transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors duration-300">
                            <Link to={`/products/${item.id}`}>
                              {item.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-primary">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                                <Badge className="bg-gradient-primary text-white border-0 text-xs">
                                  SALE
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 hover:bg-accent"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 hover:bg-accent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border/50 shadow-luxury">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                
                {/* Promo Code */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="border-border focus:ring-primary focus:border-primary"
                    />
                    <Button
                      onClick={applyPromoCode}
                      variant="outline"
                      className="hover:bg-accent hover:shadow-glow-secondary transition-all duration-300"
                    >
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="text-sm text-success">
                      ✓ {(discount * 100)}% discount applied!
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({(discount * 100)}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {shipping > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Add ${(200 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-intense transition-all duration-300 border-0"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  Proceed to Checkout
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Secure checkout powered by SSL encryption
                </div>

                <CheckoutForm
                  total={total}
                  onSubmit={placeOrder}
                  isOpen={isCheckoutOpen}
                  onOpenChange={setIsCheckoutOpen}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;