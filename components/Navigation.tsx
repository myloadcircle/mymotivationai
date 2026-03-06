'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Target, 
  Brain, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Goals', href: '/dashboard', icon: <Target className="h-5 w-5" /> },
    { name: 'AI Insights', href: '/insights', icon: <Brain className="h-5 w-5" /> },
    { name: 'Analytics', href: '/insights', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">myMotivationAI</h1>
          <p className="text-sm text-gray-600">AI-powered motivation platform</p>
        </div>

        <div className="flex-1">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`mr-3 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-5 w-5 mr-3 text-gray-500" />
              <span className="font-medium">Settings</span>
            </Link>
            
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors mt-2"
              >
                <LogOut className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {session && (
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {session.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">{session.user?.name || 'User'}</div>
                <div className="text-sm text-gray-600">{session.user?.email}</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
            <h1 className="ml-3 text-xl font-bold text-gray-900">myMotivationAI</h1>
          </div>
          
          {session && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {session.user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`mr-3 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="font-medium">Settings</span>
                </Link>
                
                {session && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors mt-1"
                  >
                    <LogOut className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}