import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useOffers } from "@/hooks/useOffers";
import { useProducts } from "@/hooks/useProducts";
import { AlertCircle, Edit, Eye, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";

interface NewOffer {
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  products: string[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  image: string;
}

export function OffersSection() {
  const { offers, loading, createOffer, updateOffer, deleteOffer, toggleOfferStatus } = useOffers();
  const { products } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [deleteConfirmOffer, setDeleteConfirmOffer] = useState<any>(null);
  const defaultOffer: NewOffer = {
    title: "",
    description: "",
    discount: 0,
    type: "percentage",
    products: [],
    isActive: true,
    startDate: "",
    endDate: "",
    image: ""
  };

  const [newOffer, setNewOffer] = useState<NewOffer>(defaultOffer);
  const [editOffer, setEditOffer] = useState<NewOffer>(defaultOffer);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Offers & Promotions
          </h1>
          <p className="text-muted-foreground">
            Create and manage special offers for featured products
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (open) {
              setNewOffer(defaultOffer);
            }
          }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow-primary transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Offer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="offer-title">Offer Title</Label>
                <Input
                  id="offer-title"
                  placeholder="Enter offer title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="offer-description">Description</Label>
                <Textarea
                  id="offer-description"
                  placeholder="Describe your offer"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select
                    value={newOffer.type}
                    onValueChange={(value: 'percentage' | 'fixed') => 
                      setNewOffer(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    placeholder="0"
                    value={newOffer.discount}
                    onChange={(e) => setNewOffer(prev => ({ 
                      ...prev, 
                      discount: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newOffer.startDate}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newOffer.endDate}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Select Products</Label>
                <div className="border rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
                  {products?.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={newOffer.products.includes(product.id)}
                        onChange={(e) => {
                          setNewOffer(prev => ({
                            ...prev,
                            products: e.target.checked
                              ? [...prev.products, product.id]
                              : prev.products.filter(id => id !== product.id)
                          }));
                        }}
                      />
                      <label htmlFor={`product-${product.id}`} className="text-sm">
                        {product.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="offer-image">Offer Image URL</Label>
                <Input
                  id="offer-image"
                  placeholder="https://..."
                  value={newOffer.image}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, image: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewOffer({
                    title: "",
                    description: "",
                    discount: 0,
                    type: "percentage",
                    products: [],
                    isActive: true,
                    startDate: "",
                    endDate: "",
                    image: ""
                  });
                }}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-primary"
                  onClick={async () => {
                    try {
                      await createOffer(newOffer);
                      setIsAddDialogOpen(false);
                      setNewOffer({
                        title: "",
                        description: "",
                        discount: 0,
                        type: "percentage",
                        products: [],
                        isActive: true,
                        startDate: "",
                        endDate: "",
                        image: ""
                      });
                    } catch (error) {
                      console.error('Error creating offer:', error);
                    }
                  }}
                >
                  Create Offer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {offers.filter(o => o.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
          </CardContent>
        </Card>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No offers found. Create your first offer by clicking the "Create Offer" button above.
            </div>
          ) : (
            offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-glow-primary transition-all">
            <div className="aspect-video relative">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={offer.isActive ? "bg-success" : "bg-muted"}>
                  {offer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-gradient-primary text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {offer.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {offer.type === 'percentage' ? `${offer.discount}%` : `$${offer.discount}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {offer.type === 'percentage' ? 'OFF' : 'DISCOUNT'}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Products:</div>
                  <div className="flex flex-wrap gap-1">
                    {offer.products.map((product, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Valid: {offer.startDate} to {offer.endDate}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={offer.isActive}
                      onCheckedChange={(checked) => toggleOfferStatus(offer.id, checked)}
                    />
                    <Label className="text-sm">Active</Label>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingOffer(offer);
                        setEditOffer({
                          title: offer.title,
                          description: offer.description,
                          discount: offer.discount,
                          type: offer.type,
                          products: offer.products,
                          isActive: offer.isActive,
                          startDate: offer.startDate,
                          endDate: offer.endDate,
                          image: offer.image
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => setDeleteConfirmOffer(offer)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit Offer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingOffer(null);
          setEditOffer(defaultOffer);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="offer-title">Offer Title</Label>
              <Input
                id="offer-title"
                placeholder="Enter offer title"
                value={editOffer.title}
                onChange={(e) => setEditOffer(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="offer-description">Description</Label>
              <Textarea
                id="offer-description"
                placeholder="Describe your offer"
                value={editOffer.description}
                onChange={(e) => setEditOffer(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount-type">Discount Type</Label>
                <Select
                  value={editOffer.type}
                  onValueChange={(value: 'percentage' | 'fixed') => 
                    setEditOffer(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discount-value">Discount Value</Label>
                <Input
                  id="discount-value"
                  type="number"
                  placeholder="0"
                  value={editOffer.discount}
                  onChange={(e) => setEditOffer(prev => ({ 
                    ...prev, 
                    discount: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={editOffer.startDate}
                  onChange={(e) => setEditOffer(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={editOffer.endDate}
                  onChange={(e) => setEditOffer(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Select Products</Label>
              <div className="border rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
                {products?.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`product-${product.id}`}
                      checked={editOffer.products.includes(product.id)}
                      onChange={(e) => {
                        setEditOffer(prev => ({
                          ...prev,
                          products: e.target.checked
                            ? [...prev.products, product.id]
                            : prev.products.filter(id => id !== product.id)
                        }));
                      }}
                    />
                    <label htmlFor={`product-${product.id}`} className="text-sm">
                      {product.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="offer-image">Offer Image URL</Label>
              <Input
                id="offer-image"
                placeholder="https://..."
                value={editOffer.image}
                onChange={(e) => setEditOffer(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingOffer(null);
                setEditOffer(defaultOffer);
              }}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-primary"
                onClick={async () => {
                  try {
                    await updateOffer(editingOffer.id, editOffer);
                    setIsEditDialogOpen(false);
                    setEditingOffer(null);
                    setEditOffer(defaultOffer);
                  } catch (error) {
                    console.error('Error updating offer:', error);
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirmOffer !== null} 
        onOpenChange={(open) => !open && setDeleteConfirmOffer(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Confirm Deletion
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{deleteConfirmOffer?.title}</span>? 
              This action cannot be undone and will remove this offer immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmOffer(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={async () => {
                if (deleteConfirmOffer) {
                  try {
                    await deleteOffer(deleteConfirmOffer.id);
                    setDeleteConfirmOffer(null);
                  } catch (error) {
                    console.error('Error deleting offer:', error);
                  }
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}