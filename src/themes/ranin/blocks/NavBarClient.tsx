"use client";

import { useState } from "react";
import { z } from "zod";
import { navBarSchema } from "./NavBar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function NavBarClient(props: z.infer<typeof navBarSchema> & { locale: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const handleMegaMenuEnter = (label: string) => setActiveMegaMenu(label);
  const handleMegaMenuLeave = () => setActiveMegaMenu(null);

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50" dir="rtl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-bold text-gray-900 z-20">{props.brand}</a>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {props.items.map((item, idx) => (
              <NavigationMenuItem key={idx}>
                {item.href ? (
                  <NavigationMenuLink href={item.href} className="text-gray-700 hover:text-blue-600">
                    {item.label}
                  </NavigationMenuLink>
                ) : (
                  <>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
                      {item.label}
                    </NavigationMenuTrigger>
                    {item.megaMenu ? (
                      <NavigationMenuContent className="bg-white">
                        <div className="grid grid-cols-2 gap-8 p-6 md:w-[800px]">
                          {item.megaMenu.columns.map((column, colIdx) => (
                            <div key={colIdx}>
                              <h3 className="font-semibold text-gray-900 mb-4 text-lg">{column.title}</h3>
                              <ul className="space-y-3">
                                {column.links.map((link, linkIdx) => (
                                  <li key={linkIdx}>
                                    <a href={link.href} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                      <div className="font-medium text-gray-900 mb-1">{link.label}</div>
                                      {link.description && <div className="text-sm text-gray-600">{link.description}</div>}
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

        <button onClick={toggleMobileMenu} className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 z-20" aria-label="Toggle mobile menu">
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-10 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMobileMenu}></div>

      <div className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-20 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{props.brand}</h2>
        </div>
        <nav className="p-6">
          <ul className="space-y-6">
            {props.items.map((item, idx) => (
              <li key={idx}>
                {item.href ? (
                  <a href={item.href} className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 text-lg" onClick={toggleMobileMenu}>
                    {item.label}
                  </a>
                ) : (
                  <div>
                    <div className="text-lg font-semibold text-gray-900 mb-4">{item.label}</div>
                    {item.megaMenu && (
                      <div className="space-y-4 me-4">
                        {item.megaMenu.columns.map((column, colIdx) => (
                          <div key={colIdx}>
                            <h4 className="font-medium text-gray-800 mb-2 text-base">{column.title}</h4>
                            <ul className="space-y-2 me-4">
                              {column.links.map((link, linkIdx) => (
                                <li key={linkIdx}>
                                  <a href={link.href} className="block text-gray-600 hover:text-blue-600 transition-colors duration-200" onClick={toggleMobileMenu}>
                                    {link.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}


