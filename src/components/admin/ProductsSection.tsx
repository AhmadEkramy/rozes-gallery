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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Product, useProducts } from "@/hooks/useProducts";
import { AlertCircle, Edit, Filter, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  images: string[];
  stock: number;
}

export function ProductsSection() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Reset form when add dialog opens
  useEffect(() => {
    if (isAddDialogOpen) {
      setFormData({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        images: [],
        discount: undefined,
      });
    }
  }, [isAddDialogOpen]);

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    images: [],
    discount: undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "price" || id === "stock" ? Number(value) : value
    }));
  };

  const handleAddProduct = async () => {
    try {
      await addProduct({
        ...formData,
        status: formData.stock > 10 ? 'active' : 'low_stock',
        image: formData.images[0] || '', // Use the first image as the main image
        images: formData.images, // Save all images
      });
      setIsAddDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        images: [],
        discount: undefined,
      });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product",
      });
    }
  };

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  
  // Handle setting form data when editing a product
  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title,
        description: editProduct.description,
        price: editProduct.price,
        stock: editProduct.stock,
        images: editProduct.images || [editProduct.image], // Use images array if available, fallback to single image
        discount: undefined, // Add discount if you have it in your product type
      });
    }
  }, [editProduct]);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmProduct(null);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Products Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow-primary transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
                          <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter product title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
                              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      placeholder="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Discount (Optional)</Label>
                    <div className="flex gap-2">
                      <select
                        className="flex h-9 w-[100px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.discount?.type || "none"}
                        onChange={(e) => {
                          const type = e.target.value as "percentage" | "fixed" | "none";
                          if (type === "none") {
                            setFormData(prev => ({ ...prev, discount: undefined }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              discount: { type, value: prev.discount?.value || 0 }
                            }));
                          }
                        }}
                      >
                        <option value="none">None</option>
                        <option value="percentage">%</option>
                        <option value="fixed">$</option>
                      </select>
                      <Input 
                        type="number"
                        placeholder={formData.discount?.type === "percentage" ? "10%" : "$10"}
                        value={formData.discount?.value || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (formData.discount?.type) {
                            setFormData(prev => ({
                              ...prev,
                              discount: { ...prev.discount!, value }
                            }));
                          }
                        }}
                        disabled={!formData.discount}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="images">Product Images</Label>
                  <div className="space-y-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={url}
                          placeholder="https://..."
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData(prev => ({ ...prev, images: newImages }));
                          }}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, images: newImages }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, ""]
                        }));
                      }}
                    >
                      Add Image URL
                    </Button>
                  </div>
                </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-primary"
                  onClick={handleAddProduct}
                  disabled={!formData.title || !formData.description || !formData.price}
                >
                  Add Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {products.filter(p => p.stock > 10).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {products.filter(p => p.stock <= 10 && p.stock > 0).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {products.filter(p => p.stock === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading products...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive py-8">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={product.stock <= 10 ? "text-warning" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.stock > 10 ? "default" : "secondary"}
                        className={product.stock > 10 ? "bg-success" : "bg-warning"}
                      >
                        {product.stock > 10 ? "In Stock" : "Low Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setFormData({
                              title: product.title,
                              description: product.description,
                              price: product.price,
                              stock: product.stock,
                              images: [product.image],
                              discount: undefined,
                            });
                            setEditProduct(product);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive"
                          onClick={() => setDeleteConfirmProduct(product)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog 
        open={editProduct !== null} 
        onOpenChange={(open) => !open && setEditProduct(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter product title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input 
                id="stock" 
                type="number" 
                placeholder="0"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="images">Product Images</Label>
              <div className="space-y-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={url}
                      placeholder="https://..."
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, ""]
                    }));
                  }}
                >
                  Add Image URL
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditProduct(null)}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-primary"
                onClick={async () => {
                  try {
                    if (editProduct) {
                      await updateProduct(editProduct.id, {
                        title: formData.title,
                        description: formData.description,
                        price: formData.price,
                        stock: formData.stock,
                        image: formData.images[0] || '', // keep main image for backwards compatibility
                        images: formData.images, // save all images
                        status: formData.stock > 10 ? 'active' : 'low_stock',
                      });
                      setEditProduct(null);
                      toast({
                        title: "Success",
                        description: "Product updated successfully",
                      });
                    }
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to update product",
                    });
                  }
                }}
                disabled={!formData.title || !formData.description || !formData.price}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirmProduct !== null} 
        onOpenChange={(open) => !open && setDeleteConfirmProduct(null)}
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
              Are you sure you want to delete <span className="font-semibold">{deleteConfirmProduct?.title}</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmProduct(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteConfirmProduct) {
                  handleDeleteProduct(deleteConfirmProduct.id);
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