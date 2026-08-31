'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  History, 
  User as UserIcon, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, quickLoginDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-border no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3">
            <Link href={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-academic-800 flex items-center justify-center text-white shadow-subtle group-hover:bg-academic-900 transition-colors">
                <ShieldCheck className="w-6 h-6 text-blue-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-foreground tracking-tight leading-none">
                  Plagiarism<span className="text-academic-700">Check</span>
                </span>
                <span className="text-[11px] font-sans text-slate-700 tracking-wider uppercase font-semibold mt-0.5">
                  Academic Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {user.role === 'student' ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/dashboard')
                        ? 'bg-academic-50 text-academic-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/upload"
                    className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/upload')
                        ? 'bg-academic-50 text-academic-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4 text-academic-600" />
                    <span>Check Document</span>
                  </Link>

                  <Link
                    href="/history"
                    className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/history')
                        ? 'bg-academic-50 text-academic-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <History className="w-4 h-4 text-slate-500" />
                    <span>Submissions</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/admin"
                    className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin')
                        ? 'bg-academic-50 text-academic-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-academic-700" />
                    <span>Admin Control Center</span>
                  </Link>
                  <Link
                    href="/upload"
                    className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/upload')
                        ? 'bg-academic-50 text-academic-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4 text-academic-600" />
                    <span>Analyze / Corpus Upload</span>
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role Switcher Demo Pill */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => quickLoginDemo('student')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      user.role === 'student'
                        ? 'bg-white text-academic-800 font-medium shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Switch to Student account"
                  >
                    Student
                  </button>
                  <button
                    onClick={() => quickLoginDemo('admin')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      user.role === 'admin'
                        ? 'bg-white text-academic-800 font-medium shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Switch to Admin account"
                  >
                    Admin
                  </button>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 text-left transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-academic-100 border border-academic-300 text-academic-800 flex items-center justify-center font-bold text-xs">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-xs leading-tight">
                      <div className="font-semibold text-slate-800 truncate max-w-[120px]">{user.name}</div>
                      <div className="text-slate-700 text-[10px] font-mono">{user.roll_number || user.role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-elevated border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                        <p className="text-[11px] text-slate-700 truncate">{user.email}</p>
                        <div className="mt-1.5 flex items-center space-x-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-academic-100 text-academic-800">
                            {user.role.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-700 font-mono">
                            {user.section ? `Sec: ${user.section}` : ''}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Academic Profile</span>
                      </Link>

                      <Link
                        href="/history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>Submission Archive</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-medium text-white bg-academic-700 hover:bg-academic-800 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {user ? (
            <>
              <div className="pb-3 border-b border-slate-100">
                <div className="font-medium text-sm text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-700 font-mono">{user.roll_number} • {user.program}</div>
              </div>

              <div className="space-y-1">
                {user.role === 'student' ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/upload"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium text-academic-700"
                    >
                      Check New Document
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                    >
                      My Submissions
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/upload"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Upload Reference Corpus
                    </Link>
                  </>
                )}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                >
                  Profile Settings
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => { quickLoginDemo('student'); setMobileMenuOpen(false); }}
                    className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-slate-50"
                  >
                    Demo Student
                  </button>
                  <button
                    onClick={() => { quickLoginDemo('admin'); setMobileMenuOpen(false); }}
                    className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-slate-50"
                  >
                    Demo Admin
                  </button>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-xs text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 px-4 rounded-lg bg-academic-700 text-sm font-medium text-white"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
