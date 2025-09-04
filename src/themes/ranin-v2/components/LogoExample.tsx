import React from 'react';
import Logo from './Logo';

/**
 * Example component demonstrating different Logo configurations
 * You can copy these examples to use the Logo component throughout your app
 */
export default function LogoExample() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Logo Component Examples</h1>
      
      {/* Default Logo */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Default Logo</h2>
        <Logo />
      </div>

      {/* Custom Size */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Custom Size (100x40)</h2>
        <Logo width={100} height={40} />
      </div>

      {/* Large Logo */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Large Logo (400x150)</h2>
        <Logo width={400} height={150} />
      </div>

      {/* Different Colors */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Different Colors</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="text-center">
            <p className="text-sm mb-2">Blue</p>
            <Logo width={150} height={60} color="#3B82F6" />
          </div>
          <div className="text-center">
            <p className="text-sm mb-2">Red</p>
            <Logo width={150} height={60} color="#EF4444" />
          </div>
          <div className="text-center">
            <p className="text-sm mb-2">Green</p>
            <Logo width={150} height={60} color="#10B981" />
          </div>
          <div className="text-center">
            <p className="text-sm mb-2">Purple</p>
            <Logo width={150} height={60} color="#8B5CF6" />
          </div>
        </div>
      </div>

      {/* On Dark Background */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">On Dark Background</h2>
        <div className="bg-gray-900 p-6 rounded">
          <Logo width={200} height={75} color="#FFFFFF" />
        </div>
      </div>

      {/* With CSS Classes */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">With CSS Classes (hover effect)</h2>
        <Logo 
          width={200} 
          height={75} 
          color="#6B7280" 
          className="hover:opacity-70 transition-opacity cursor-pointer"
        />
      </div>

      {/* Responsive with string units */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Responsive (using string units)</h2>
        <Logo width="100%" height="80px" color="#1F2937" className="max-w-xs" />
      </div>
    </div>
  );
}

/**
 * Usage Examples:
 * 
 * 1. Basic usage:
 * <Logo />
 * 
 * 2. Custom size and color:
 * <Logo width={300} height={120} color="#3B82F6" />
 * 
 * 3. With CSS classes:
 * <Logo className="hover:opacity-80 transition-opacity" />
 * 
 * 4. Responsive sizing:
 * <Logo width="100%" height="60px" className="max-w-sm" />
 * 
 * 5. For different themes:
 * <Logo color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
 */
