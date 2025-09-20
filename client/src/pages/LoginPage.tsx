import React, { useState } from 'react';
import LoginComponent from '@/components/LoginComponent';
import { Store, Heart, Star } from 'lucide-react';


const PhotoGallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    {
      src: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=800&fit=crop",
      alt: "Traditional Indian Sweets",
      title: "Traditional Mithai"
    },
    {
      src: "./sweet1.jpg",
      alt: "Gulab Jamun",
      title: "Sweet Delicacies"
    },
    {
      src: "./sweet2.jpg",
      alt: "Colorful Sweets",
      title: "Festive Collection"
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}
      
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h3 className="text-2xl font-bold mb-2">{images[currentImage].title}</h3>
        <p className="text-white/90 mb-4">Authentic flavors that bring joy to every celebration</p>
        
        <div className="flex space-x-2 mb-4">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImage ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleMode = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsFlipped(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-4rem)]">
          {/* Left Side - Login/Register Form */}
          <div className="flex items-center justify-center">
            <div 
              className={`w-full max-w-lg transition-transform duration-300 ${
                isFlipped ? 'transform rotateY-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <LoginComponent onToggleMode={handleToggleMode} isLogin={isLogin} />
            </div>
          </div>

          {/* Right Side - Branding and Gallery */}
          <div className="flex flex-col justify-center space-y-6 lg:pl-8 overflow-hidden">
            {/* Brand Header */}
            <div className="text-center lg:text-left flex-shrink-0">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Store className="h-10 w-10 text-orange-600 mr-3" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                    Mithaiwala
                  </h1>
                  <p className="text-base text-muted-foreground mt-1">स्वादिष्ट मिठाई का घर</p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-4">
                Crafting traditional Indian sweets with love and authenticity since generations
              </p>
              
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
                  <span>Made with Love</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="h-80 lg:h-96 rounded-2xl shadow-2xl overflow-hidden flex-shrink-0">
              <PhotoGallery />
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 text-center lg:text-left flex-shrink-0">
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="text-xl font-bold text-orange-600 mb-1">25+</div>
                <div className="text-xs text-muted-foreground">Sweet Varieties</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="text-xl font-bold text-amber-600 mb-1">50+</div>
                <div className="text-xs text-muted-foreground">Years Legacy</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="text-xl font-bold text-orange-700 mb-1">1000+</div>
                <div className="text-xs text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;