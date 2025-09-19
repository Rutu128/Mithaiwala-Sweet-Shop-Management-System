import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Mail, Lock, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LoginComponent = ({ onToggleMode, isLogin = true }: { onToggleMode: () => void, isLogin: boolean }) => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isLogin) {
          await login(formData.email, formData.password);
        } else {
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
          });
        }
        
        // Start flip animation
        setIsFlipping(true);
        
        // After flip animation completes, navigate to home page
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        // Toast is already shown by AuthContext
      } finally {
        setLoading(false);
      }
    };

    // Function to reverse text
    const reverseText = (text: string) => {
      return text.split('').reverse().join('');
    };
  
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-orange-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Mithaiwala
              </h1>
            </div>
            <p className="text-muted-foreground">
              {isFlipping 
                ? reverseText(isLogin ? 'Welcome back to your sweet journey' : 'Join our sweet family today')
                : (isLogin ? 'Welcome back to your sweet journey' : 'Join our sweet family today')
              }
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}
  
          <Card className={`border-0 shadow-xl transition-transform duration-1000 ${isFlipping ? 'transform rotateY-180' : ''}`}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">
                {isFlipping 
                  ? reverseText(isLogin ? 'Sign In' : 'Create Account')
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </CardTitle>
              <CardDescription>
                {isFlipping 
                  ? reverseText(isLogin 
                    ? 'Enter your credentials to access your account' 
                    : 'Fill in your details to get started'
                  )
                  : (isLogin 
                    ? 'Enter your credentials to access your account' 
                    : 'Fill in your details to get started'
                  )
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {isFlipping ? reverseText('First Name') : 'First Name'}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          className="pl-10"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {isFlipping ? reverseText('Last Name') : 'Last Name'}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          className="pl-10"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </div>
                )}
  
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {isFlipping ? reverseText('Email') : 'Email'}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {isFlipping ? reverseText('Password') : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
  
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {isFlipping ? reverseText('Confirm Password') : 'Confirm Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={!isLogin}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
  
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{isFlipping ? reverseText('Remember me') : 'Remember me'}</span>
                    </label>
                    <Button variant="link" className="px-0 text-sm">
                      {isFlipping ? reverseText('Forgot password?') : 'Forgot password?'}
                    </Button>
                  </div>
                )}
  
                <Button 
                  type="button" 
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all duration-300"
                  onClick={handleSubmit}
                  disabled={isFlipping || loading}
                >
                  {loading ? 'Please wait...' : (isFlipping 
                    ? reverseText(isLogin ? 'Sign In' : 'Create Account')
                    : (isLogin ? 'Sign In' : 'Create Account')
                  )}
                </Button>
              </div>
  
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isFlipping 
                    ? reverseText(isLogin ? "Don't have an account? " : "Already have an account? ")
                    : (isLogin ? "Don't have an account? " : "Already have an account? ")
                  }
                  <Button 
                    variant="link" 
                    className="px-0 font-medium text-orange-600 hover:text-orange-700"
                    onClick={onToggleMode}
                    disabled={isFlipping}
                  >
                    {isFlipping 
                      ? reverseText(isLogin ? 'Sign up' : 'Sign in')
                      : (isLogin ? 'Sign up' : 'Sign in')
                    }
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };


  export default LoginComponent;