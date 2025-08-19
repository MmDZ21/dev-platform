"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/components/ThemeProvider";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "@/icons";
import SidebarWidget from "./SidebarWidget";
import { ThemeToggleButton } from "@/components/admin/layout/common/ThemeToggleButton";
import { adminModelRegistry, adminMenuGroups} from "@/modules/registry";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// ==== داینامیک‌سازی آیتم‌های پروژه =====
const modulesArr = Object.entries(adminModelRegistry);
const rootModules = modulesArr.filter(
  ([, meta]) => !("parent" in meta && meta.parent)
);
const getChildren = (parentKey: string) =>
  modulesArr.filter(
    ([, meta]) => "parent" in meta && meta.parent === parentKey
  );

const dynamicNavItems: NavItem[] = adminMenuGroups.map((group) => ({
  name: group.name,
  icon: <group.icon />,
  // گروه خودش path نداره، فقط زیرمنوها داره
  subItems: group.children.map((childKey) => {
    const meta = adminModelRegistry[childKey as keyof typeof adminModelRegistry];
    return {
      name: meta.name,
      path: `/admin/${childKey}`,
    };
  }),
}));

// ==== (در صورت نیاز، آیتم‌های ثابت داشبورد و...) ====
const staticNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "داشبورد",
    subItems: [{ name: "خانه", path: "/admin", pro: false }],
  },
];

// آیتم نهایی سایدبار: (اول آیتم‌های ثابت، بعد آیتم‌های داینامیک پروژه)
const navItems: NavItem[] = [...staticNavItems, ...dynamicNavItems];

// othersItems مثل قبل اگر داشتی (مثلاً چارت و ...):
const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "نمودارها",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  // ... هر چی خواستی
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { currentTheme, setCurrentTheme } = useTheme();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ms-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 ms-6">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}  className="border-s border-white/20 px-2 py-1">
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ms-auto">
                        {subItem.new && (
                          <span
                            className={`ms-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ms-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 h-screen lg:h-auto lg:inset-y-4 px-5 start-0 lg:start-8 lg:rounded-3xl transition-all duration-300 ease-in-out z-50 border-e
        ${currentTheme === 'dark' ? 'bg-[var(--panel-bg)] border-[var(--panel-border)] text-[var(--color-gray-100)]' : 'bg-white border-gray-200 text-gray-900'}
        ${
          isExpanded || isMobileOpen
            ? "w-[var(--sidebar-expanded-width)]"
            : isHovered
            ? "w-[var(--sidebar-expanded-width)]"
            : "w-[var(--sidebar-collapsed-width)]"
        }
        ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 hidden lg:flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className={currentTheme === 'light' ? 'block' : 'hidden'}
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className={currentTheme === 'dark' ? 'block' : 'hidden'}
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pt-8 lg:pt-0">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] ${
                  currentTheme === 'dark' ? 'text-[var(--color-gray-400)]' : 'text-gray-400'
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {/* Line tree before menu buttons */}
              {(isExpanded || isHovered || isMobileOpen) && (
                <div className="ms-4 mb-2 border-s border-gray-200 dark:border-[var(--panel-border)]" style={{ height: 8 }} />
              )}
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] ${
                  currentTheme === 'dark' ? 'text-[var(--color-gray-400)]' : 'text-gray-400'
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {(isExpanded || isHovered || isMobileOpen) && (
                <div className="ms-4 mb-2 border-s border-gray-200 dark:border-[var(--panel-border)]" style={{ height: 8 }} />
              )}
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {/* Theme Switcher (icon toggle) */}
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className={`mt-auto p-4 border-t ${
            currentTheme === 'dark' ? 'border-[var(--panel-border)]' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                currentTheme === 'dark' ? 'text-[var(--color-gray-300)]' : 'text-gray-600'
              }`}>
                Theme
              </span>
              <ThemeToggleButton />
            </div>
          </div>
        )}
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
