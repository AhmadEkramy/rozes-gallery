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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useCoupons } from "@/hooks/useCoupons";
import { Calendar, Copy, DollarSign, Edit, Percent, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function CouponsSection() {
  const { 
    coupons, 
    stats,
    loading,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus
  } = useCoupons();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<NewCouponState | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  type CouponType = 'percentage' | 'fixed';
  
  interface NewCouponState {
    id?: string;
    code: string;
    type: CouponType;
    value: number;
    maxUses: number;
    expiryDate: string;
    minPurchase: number;
    isActive: boolean;
    description: string;
  }

  const [newCoupon, setNewCoupon] = useState<NewCouponState>({
    code: "",
    type: "percentage",
    value: 0,
    maxUses: 0,
    expiryDate: "",
    minPurchase: 0,
    isActive: true,
    description: ""
  });
  const { toast } = useToast();
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Coupon code "${code}" copied to clipboard`,
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Coupons Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage discount coupons with usage limits and expiration dates
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow-primary transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <div className="flex">
                    <Input 
                      id="coupon-code" 
                      placeholder="Enter code or generate"
                      className="rounded-r-none"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={() => {
                        setNewCoupon(prev => ({ ...prev, code: generateCouponCode() }));
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select
                    value={newCoupon.type}
                    onValueChange={(value: 'percentage' | 'fixed') => 
                      setNewCoupon(prev => ({ ...prev, type: value }))
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
                    value={newCoupon.value || ''}
                    onChange={(e) => setNewCoupon(prev => ({ 
                      ...prev,
                      value: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usage-limit">Usage Limit</Label>
                  <Input
                    id="usage-limit"
                    type="number"
                    placeholder="Unlimited"
                    value={newCoupon.maxUses || ''}
                    onChange={(e) => setNewCoupon(prev => ({
                      ...prev,
                      maxUses: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon(prev => ({
                      ...prev,
                      expiryDate: e.target.value
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="min-purchase">Minimum Purchase Amount (Optional)</Label>
                <Input
                  id="min-purchase"
                  type="number"
                  placeholder="0"
                  value={newCoupon.minPurchase || ''}
                  onChange={(e) => setNewCoupon(prev => ({
                    ...prev,
                    minPurchase: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active-status"
                  checked={newCoupon.isActive}
                  onCheckedChange={(checked) => setNewCoupon(prev => ({
                    ...prev,
                    isActive: checked
                  }))}
                />
                <Label htmlFor="active-status">Active immediately</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewCoupon({
                      code: "",
                      type: "percentage",
                      value: 0,
                      maxUses: 0,
                      expiryDate: "",
                      minPurchase: 0,
                      isActive: true,
                      description: ""
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={async () => {
                    try {
                      if (!newCoupon.code || !newCoupon.value || !newCoupon.expiryDate) {
                        toast({
                          title: "Error",
                          description: "Please fill in all required fields",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      await createCoupon(newCoupon);
                      setIsAddDialogOpen(false);
                      setNewCoupon({
                        code: "",
                        type: "percentage",
                        value: 0,
                        maxUses: 0,
                        expiryDate: "",
                        minPurchase: 0,
                        isActive: true,
                        description: ""
                      });
                    } catch (error) {
                      console.error('Error creating coupon:', error);
                    }
                  }}
                >
                  Create Coupon
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-l-4 border-l-muted animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Coupons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Coupons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {stats.active}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {stats.totalUsed}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-destructive">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expired Coupons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {stats.expired}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-full" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No coupons found. Create your first coupon by clicking the "Create Coupon" button above.
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => {
                    const usagePercentage = getUsagePercentage(coupon.usedCount, coupon.maxUses);
                    const expired = isExpired(coupon.expiryDate);
                    const fullyUsed = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
                    
                    return (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {coupon.code}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(coupon.code)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {coupon.description}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {coupon.type === 'percentage' ? (
                              <Percent className="w-3 h-3" />
                            ) : (
                              <DollarSign className="w-3 h-3" />
                            )}
                            <span className="capitalize">{coupon.type}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-medium">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {coupon.usedCount} / {coupon.maxUses || '∞'}
                            </div>
                            {coupon.maxUses > 0 && (
                              <>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      usagePercentage >= 90 ? 'bg-destructive' : 
                                      usagePercentage >= 70 ? 'bg-warning' : 'bg-primary'
                                    }`}
                                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {usagePercentage}% used
                                </div>
                              </>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className={expired ? "text-destructive" : ""}>
                              {coupon.expiryDate}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-2">
                            <Badge
                              variant={
                                expired || fullyUsed ? "destructive" :
                                coupon.isActive ? "default" : "secondary"
                              }
                              className={
                                expired || fullyUsed ? "" :
                                coupon.isActive ? "bg-success" : ""
                              }
                            >
                              {expired ? "Expired" : 
                               fullyUsed ? "Used Up" :
                               coupon.isActive ? "Active" : "Inactive"}
                            </Badge>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={coupon.isActive}
                                onCheckedChange={(checked) => toggleCouponStatus(coupon.id, checked)}
                                disabled={expired || fullyUsed}
                              />
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedCoupon({
                                  id: coupon.id,
                                  code: coupon.code,
                                  type: coupon.type,
                                  value: coupon.value,
                                  maxUses: coupon.maxUses,
                                  expiryDate: coupon.expiryDate,
                                  minPurchase: coupon.minPurchase || 0,
                                  isActive: coupon.isActive,
                                  description: coupon.description
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
                              onClick={() => {
                                setCouponToDelete(coupon.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-code">Coupon Code</Label>
                  <Input 
                    id="edit-code" 
                    value={selectedCoupon.code}
                    onChange={(e) => setSelectedCoupon(prev => ({ ...prev!, code: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={selectedCoupon.description}
                    onChange={(e) => setSelectedCoupon(prev => ({ ...prev!, description: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">Discount Type</Label>
                  <Select
                    value={selectedCoupon.type}
                    onValueChange={(value: 'percentage' | 'fixed') => 
                      setSelectedCoupon(prev => ({ ...prev!, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-value">Discount Value</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={selectedCoupon.value}
                    onChange={(e) => setSelectedCoupon(prev => ({ 
                      ...prev!,
                      value: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-limit">Usage Limit</Label>
                  <Input
                    id="edit-limit"
                    type="number"
                    value={selectedCoupon.maxUses}
                    onChange={(e) => setSelectedCoupon(prev => ({
                      ...prev!,
                      maxUses: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-expiry">Expiry Date</Label>
                  <Input
                    id="edit-expiry"
                    type="date"
                    value={selectedCoupon.expiryDate}
                    onChange={(e) => setSelectedCoupon(prev => ({
                      ...prev!,
                      expiryDate: e.target.value
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-min-purchase">Minimum Purchase Amount</Label>
                <Input
                  id="edit-min-purchase"
                  type="number"
                  value={selectedCoupon.minPurchase}
                  onChange={(e) => setSelectedCoupon(prev => ({
                    ...prev!,
                    minPurchase: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-status"
                  checked={selectedCoupon.isActive}
                  onCheckedChange={(checked) => setSelectedCoupon(prev => ({
                    ...prev!,
                    isActive: checked
                  }))}
                />
                <Label htmlFor="edit-status">Active</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCoupon(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={async () => {
                    try {
                      if (!selectedCoupon.code || !selectedCoupon.value || !selectedCoupon.expiryDate) {
                        toast({
                          title: "Error",
                          description: "Please fill in all required fields",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      const { id, ...updateData } = selectedCoupon;
                      await updateCoupon(id!, updateData);
                      setIsEditDialogOpen(false);
                      setSelectedCoupon(null);
                      toast({
                        title: "Success",
                        description: "Coupon updated successfully",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update coupon",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Update Coupon
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-center text-muted-foreground">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCouponToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  if (couponToDelete) {
                    await deleteCoupon(couponToDelete);
                    setIsDeleteDialogOpen(false);
                    setCouponToDelete(null);
                    toast({
                      title: "Success",
                      description: "Coupon deleted successfully",
                    });
                  }
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to delete coupon",
                    variant: "destructive"
                  });
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}