"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { navBarSchema } from "./NavBar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../design-system/primitives/navigation-menu";
import { Container, Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetOverlay, Button } from "../design-system";
import { Input } from "../design-system/primitives/input";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import LogoExample from "../components/LogoExample";

// Icon components
const Search = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Sun = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const Moon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
  </svg>
);

const LogIn = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
);


export default function NavBarClient(props: z.infer<typeof navBarSchema> & { locale: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(false);

  // Theme toggle functionality
  useEffect(() => {
    // Check for existing theme preference
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored === 'dark' || (!stored && prefersDark);
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const handleMegaMenuEnter = (label: string) => setActiveMegaMenu(label);
  const handleMegaMenuLeave = () => setActiveMegaMenu(null);
  
  const toggleGroup = (label: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground z-20">
            {/* <Logo  
              className="h-4 w-4 text-blue-300"
            /> */}
            {/* {props.brand} */}
            <Logo width={150} height={40} color="#038125" />
          </Link>

          <NavigationMenu viewport={false} className="hidden lg:flex">
            <NavigationMenuList>
              {props.items.map((item, idx) => (
                <NavigationMenuItem key={idx}>
                  {item.href ? (
                    <NavigationMenuLink href={item.href} className="rounded-sm p-2 text-foreground hover:bg-accent">
                      {item.label}
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="rounded-sm p-2 text-foreground hover:bg-accent data-[state=open]:bg-accent hover:text-accent-foreground">
                        {item.label}
                      </NavigationMenuTrigger>
                      {item.megaMenu ? (
                        <NavigationMenuContent className="bg-popover text-popover-foreground">
                          <div className="grid grid-cols-2 gap-8 p-6 md:w-[800px]">
                            {item.megaMenu.columns.map((column, colIdx) => (
                              <div key={colIdx}>
                                <h3 className="font-semibold text-foreground mb-4 text-lg">{column.title}</h3>
                                <ul className="space-y-3">
                                  {column.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                      <a href={link.href} className="group block rounded-lg p-3 transition-colors duration-200 hover:bg-accent">
                                        <div className="mb-1 font-medium text-foreground group-hover:text-accent-foreground">{link.label}</div>
                                        {link.description && <div className="text-sm text-muted-foreground group-hover:text-accent-foreground/80">{link.description}</div>}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      ) : null}
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Right Side Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 z-10" />
            <Input 
              placeholder="جستجو..." 
              className="w-64 bg-transparent text-sm rounded-full pl-10 placeholder:text-muted-foreground" 
            />
          </div>
          
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            className="gap-2 flex flex-row items-center"
            aria-label="تغییر حالت تاریک"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4" />
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
              </>
            )}
          </Button>
          
          {/* Sign In Button */}
          <Button variant="default" className="gap-2 flex flex-row items-center">
            <LogIn className="h-4 w-4" /> 
            ورود
          </Button>
        </div>

        <button onClick={toggleMobileMenu} className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 z-20" aria-label="تغییر منوی موبایل">
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetOverlay onClick={() => setIsMobileMenuOpen(false)} />
        <SheetContent side="right" className="w-80 flex flex-col">
          <SheetHeader className="shrink-0">
            <SheetTitle>{props.brand}</SheetTitle>
          </SheetHeader>
          
          {/* Mobile Search and Actions */}
          <div className="px-4 py-4 border-b border-border/50">
            {/* Mobile Search */}
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2 mb-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="جستجو..."
                className="flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-muted-foreground" 
              />
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" className="gap-2 flex-1 justify-start">
                <LogIn className="h-4 w-4" /> 
                ورود
              </Button>
              
              {/* Mobile Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleTheme}
                className="gap-2 flex flex-row items-center ml-2"
                aria-label="تغییر حالت تاریک"
              >
                {isDark ? (
                  <>
                    <Sun className="h-4 w-4" />
                    روشن
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    تاریک
                  </>
                )}
              </Button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              {props.items.map((item, idx) => (
                <div key={idx} className="border-b border-border/50 last:border-b-0">
                  {item.href ? (
                    <a 
                      href={item.href} 
                      className="flex items-center px-3 py-4 text-foreground hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1 my-1" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="font-medium">{item.label}</span>
                    </a>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleGroup(item.label)}
                        className="flex items-center justify-between w-full px-3 py-4 text-left hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1 my-1"
                      >
                        <span className="font-medium text-foreground">{item.label}</span>
                        <svg
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                            expandedGroups.has(item.label) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {item.megaMenu && expandedGroups.has(item.label) && (
                        <div className="ml-6 pb-2 space-y-1">
                          {item.megaMenu.columns.map((column, colIdx) => (
                            <div key={colIdx}>
                              <h4 className="px-3 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                {column.title}
                              </h4>
                              <div className="space-y-1">
                                {column.links.map((link, linkIdx) => (
                                  <a
                                    key={linkIdx}
                                    href={link.href}
                                    className="flex flex-col px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors duration-200 rounded-md mx-1"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    <span className="font-medium">{link.label}</span>
                                    {link.description && (
                                      <span className="text-xs text-muted-foreground/80 mt-1">
                                        {link.description}
                                      </span>
                                    )}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      </Container>
    </header>
  );
}


