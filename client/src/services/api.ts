import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This enables sending cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error';
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      // Redirect to login if not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    } else {
      // Show error toast for all other errors
      toast.error(message);
    }
    
    throw new Error(message);
  }
);

// Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Sweet {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSweetData {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  quantity: number;
}

export interface UpdateSweetData {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  category?: string;
  quantity?: number;
}

export interface PurchaseData {
  quantity: number;
}

export interface RestockData {
  quantity: number;
}

export interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// API Functions
export const sweetsAPI = {
  // Get all sweets
  getAllSweets: async (): Promise<{ message: string; sweets: Sweet[] }> => {
    console.log('Fetching sweets from:', `${API_BASE_URL}/sweets`);
    return await apiClient.get('/sweets');
  },

  // Get sweet by ID
  getSweetById: async (id: string): Promise<{ message: string; sweet: Sweet }> => {
    return await apiClient.get(`/sweets/${id}`);
  },

  // Create new sweet
  createSweet: async (data: CreateSweetData): Promise<{ message: string; sweet: Sweet }> => {
    console.log('Creating sweet:', data);
    return await apiClient.post('/sweets', data);
  },

  // Update sweet
  updateSweet: async (id: string, data: UpdateSweetData): Promise<{ message: string; sweet: Sweet }> => {
    return await apiClient.put(`/sweets/${id}`, data);
  },

  // Delete sweet
  deleteSweet: async (id: string): Promise<{ message: string }> => {
    return await apiClient.delete(`/sweets/${id}`);
  },

  // Purchase sweet
  purchaseSweet: async (id: string, data: PurchaseData): Promise<{ message: string; sweet: Sweet; purchaseQuantity: number }> => {
    return await apiClient.post(`/sweets/${id}/purchase`, data);
  },

  // Restock sweet
  restockSweet: async (id: string, data: RestockData): Promise<{ message: string; sweet: Sweet; restockQuantity: number }> => {
    return await apiClient.post(`/sweets/${id}/restock`, data);
  },

  // Search sweets
  searchSweets: async (params: SearchParams): Promise<{ message: string; sweets: Sweet[]; totalResults: number; searchCriteria: SearchParams }> => {
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    
    return await apiClient.get(`/sweets/search?${queryParams}`);
  },
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ message: string; token: string; user: User }> => {
    console.log('Logging in with:', email);
    return await apiClient.post('/auth/login', { email, password });
  },

  register: async (userData: { firstName: string; lastName: string; email: string; password: string }): Promise<{ message: string; token: string; user: User }> => {
    console.log('Registering user:', userData.email);
    return await apiClient.post('/auth/register', userData);
  },

  logout: async (): Promise<{ message: string }> => {
    console.log('Logging out user');
    return await apiClient.post('/auth/logout');
  },

  ping: async (): Promise<{ message: string; user: User }> => {
    console.log('Checking authentication status');
    return await apiClient.get('/auth/ping');
  },
};
