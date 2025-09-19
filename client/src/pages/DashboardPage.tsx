import { useState, useEffect } from 'react';
import { Store, Plus, Edit, Trash2, ShoppingCart, Search, Filter, Package, TrendingUp, RotateCcw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sweetsAPI, type Sweet } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';


// Sweet interface is imported from API

interface CartItem {
  sweet: Sweet;
  quantity: number;
}

const HomePage = () => {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSweet, setNewSweet] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'other',
    quantity: ''
  });
  const [restockQuantity, setRestockQuantity] = useState('');

  const categories = ['all', 'chocolate', 'caramel', 'toffee', 'fudge', 'other'];

  // Load sweets from API on component mount
  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.getAllSweets();
      setSweets(response.sweets);
      console.log('Loaded sweets:', response.sweets.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sweets';
      setError(errorMessage);
      // Toast is already shown by API service
      console.error('Error loading sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter sweets based on search and category
  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sweet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sweet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart
  const addToCart = (sweet: Sweet) => {
    const existingItem = cart.find(item => item.sweet._id === sweet._id);
    if (existingItem) {
      if (existingItem.quantity < sweet.quantity) {
        setCart(cart.map(item => 
          item.sweet._id === sweet._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { sweet, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (sweetId: string) => {
    setCart(cart.filter(item => item.sweet._id !== sweetId));
  };

  // Update cart quantity
  const updateCartQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
    } else {
      const sweet = sweets.find(s => s._id === sweetId);
      if (sweet && quantity <= sweet.quantity) {
        setCart(cart.map(item => 
          item.sweet._id === sweetId 
            ? { ...item, quantity }
            : item
        ));
      }
    }
  };

  // Add new sweet
  const handleAddSweet = async () => {
    if (newSweet.name && newSweet.price && newSweet.description && newSweet.image && newSweet.quantity) {
      try {
        setLoading(true);
        setError(null);
        const sweetData = {
          name: newSweet.name,
          price: parseFloat(newSweet.price),
          description: newSweet.description,
          image: newSweet.image,
          category: newSweet.category,
          quantity: parseInt(newSweet.quantity)
        };
        
        await sweetsAPI.createSweet(sweetData);
        await loadSweets(); // Reload sweets from API
        setNewSweet({ name: '', price: '', description: '', image: '', category: 'other', quantity: '' });
        setShowAddForm(false);
        toast.success('Sweet added successfully!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add sweet';
        setError(errorMessage);
        // Toast is already shown by API service
        console.error('Error adding sweet:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const errorMessage = 'Please fill in all fields';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Update sweet
  const handleUpdateSweet = async () => {
    if (editingSweet && newSweet.name && newSweet.price && newSweet.description && newSweet.image && newSweet.quantity) {
      try {
        setLoading(true);
        setError(null);
        const updateData = {
          name: newSweet.name,
          price: parseFloat(newSweet.price),
          description: newSweet.description,
          image: newSweet.image,
          category: newSweet.category,
          quantity: parseInt(newSweet.quantity)
        };
        await sweetsAPI.updateSweet(editingSweet._id, updateData);
        await loadSweets(); // Reload sweets from API
        setEditingSweet(null);
        setNewSweet({ name: '', price: '', description: '', image: '', category: 'other', quantity: '' });
        setShowAddForm(false);
        toast.success('Sweet updated successfully!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update sweet';
        setError(errorMessage);
        // Toast is already shown by API service
      } finally {
        setLoading(false);
      }
    }
  };

  // Delete sweet
  const handleDeleteSweet = async (sweetId: string) => {
    try {
      setLoading(true);
      setError(null);
      await sweetsAPI.deleteSweet(sweetId);
      await loadSweets(); // Reload sweets from API
      removeFromCart(sweetId);
      toast.success('Sweet deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete sweet';
      setError(errorMessage);
      // Toast is already shown by API service
    } finally {
      setLoading(false);
    }
  };

  // Restock sweet
  const handleRestockSweet = async () => {
    if (restockingSweet && restockQuantity) {
      try {
        setLoading(true);
        setError(null);
        const quantity = parseInt(restockQuantity);
        await sweetsAPI.restockSweet(restockingSweet._id, { quantity });
        await loadSweets(); // Reload sweets from API
        setRestockingSweet(null);
        setRestockQuantity('');
        setShowRestockForm(false);
        toast.success('Sweet restocked successfully!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to restock sweet';
        setError(errorMessage);
        // Toast is already shown by API service
      } finally {
        setLoading(false);
      }
    }
  };

  // Purchase
  const handlePurchase = async () => {
    try {
      setLoading(true);
      setError(null);
      // Create purchase data for each item in cart
      const purchasePromises = cart.map(item => 
        sweetsAPI.purchaseSweet(item.sweet._id, { quantity: item.quantity })
      );
      
      await Promise.all(purchasePromises);
      await loadSweets(); // Reload sweets from API
      setCart([]);
      toast.success('Purchase successful! Thank you for your order.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete purchase';
      setError(errorMessage);
      // Toast is already shown by API service
    } finally {
      setLoading(false);
    }
  };

  // Calculate total
  const cartTotal = cart.reduce((total, item) => total + (item.sweet.price * item.quantity), 0);

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-red-100 border border-red-300 rounded-xl shadow-lg max-w-md">
            <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">You need to be logged in to access this page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <Store className="h-10 w-10 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                Mithaiwala Sweet Shop
              </h1>
              <p className="text-base text-gray-600 font-medium">स्वादिष्ट मिठाई का घर - Home of Delicious Sweets</p>
              {user && (
                <p className="text-sm text-orange-600 font-medium">
                  Welcome, {user.firstName} {user.lastName} {isAdmin && '(Admin)'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sweet
              </Button>
            )}
            <div className="relative p-3 bg-white rounded-xl shadow-lg border border-orange-200">
              <ShoppingCart className="h-6 w-6 text-orange-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sweets</p>
                <p className="text-3xl font-bold text-orange-600">{sweets.length}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cart Items</p>
                <p className="text-3xl font-bold text-amber-600">{cart.reduce((total, item) => total + item.quantity, 0)}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cart Total</p>
                <p className="text-3xl font-bold text-green-600">₹{cartTotal}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold text-purple-600">{categories.length - 1}</p>
              </div>
              <Store className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sweets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sweets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredSweets.map((sweet) => (
            <Card key={sweet._id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="relative">
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-orange-600">
                  ₹{sweet.price}
                </div>
                {sweet.quantity === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-xl">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{sweet.name}</CardTitle>
                <CardDescription>{sweet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Stock: {sweet.quantity} pieces
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {sweet.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {sweet.quantity > 0 ? (
                    <Button
                      onClick={() => addToCart(sweet)}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button disabled className="flex-1">
                      Out of Stock
                    </Button>
                  )}
                  
                  {isAdmin && (
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSweet(sweet);
                          setNewSweet({
                            name: sweet.name,
                            price: sweet.price.toString(),
                            description: sweet.description,
                            image: sweet.image,
                            category: sweet.category,
                            quantity: sweet.quantity.toString()
                          });
                        }}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRestockingSweet(sweet);
                          setShowRestockForm(true);
                        }}
                        className="border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSweet(sweet._id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Sidebar */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-2xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.sweet._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.sweet.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.sweet.price} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.sweet._id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.sweet._id, item.quantity + 1)}
                      disabled={item.quantity >= item.sweet.quantity}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total: ₹{cartTotal}</span>
              </div>
              <Button
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Purchase Now
              </Button>
            </div>
          </div>
        )}

        {/* Add/Edit Sweet Modal */}
        {(showAddForm || editingSweet) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Sweet Name"
                  value={newSweet.name}
                  onChange={(e) => setNewSweet({...newSweet, name: e.target.value})}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={newSweet.price}
                  onChange={(e) => setNewSweet({...newSweet, price: e.target.value})}
                />
                <Input
                  placeholder="Description"
                  value={newSweet.description}
                  onChange={(e) => setNewSweet({...newSweet, description: e.target.value})}
                />
                <Input
                  placeholder="Image URL"
                  value={newSweet.image}
                  onChange={(e) => setNewSweet({...newSweet, image: e.target.value})}
                />
                <select
                  value={newSweet.category}
                  onChange={(e) => setNewSweet({...newSweet, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Quantity"
                  type="number"
                  value={newSweet.quantity}
                  onChange={(e) => setNewSweet({...newSweet, quantity: e.target.value})}
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={editingSweet ? handleUpdateSweet : handleAddSweet}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                  {editingSweet ? 'Update' : 'Add'} Sweet
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSweet(null);
                    setNewSweet({ name: '', price: '', description: '', image: '', category: 'other', quantity: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Restock Modal */}
        {showRestockForm && restockingSweet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Restock {restockingSweet.name}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock: {restockingSweet.quantity} pieces
                  </label>
                  <Input
                    placeholder="Enter quantity to add"
                    type="number"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleRestockSweet}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restock
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRestockForm(false);
                    setRestockingSweet(null);
                    setRestockQuantity('');
                  }}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
