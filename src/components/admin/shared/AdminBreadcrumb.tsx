"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { adminModelRegistry, type AdminModelKey } from "@/modules/registry";
import { Home, ChevronRight } from "lucide-react";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

interface AdminBreadcrumbProps {
  showHome?: boolean;
  className?: string;
}

export function AdminBreadcrumb({ showHome = true, className = "" }: AdminBreadcrumbProps) {
  const pathname = usePathname();
  const params = useParams();
  
  // Parse the path to build breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [];
  
  if (showHome) {
    breadcrumbItems.push({
      label: "خانه",
      href: "/admin",
      icon: <Home className="h-4 w-4" />
    });
  }
  
  // Add admin segment
  if (pathSegments.includes('admin')) {
    breadcrumbItems.push({
      label: "پنل مدیریت",
      href: "/admin",
      isCurrent: pathSegments.length === 1
    });
  }
  
  // Add model segment if exists
  if (pathSegments.length > 1 && pathSegments[1] !== 'admin') {
    const modelKey = pathSegments[1] as AdminModelKey;
    const modelMeta = adminModelRegistry[modelKey];
    
    if (modelMeta) {
      breadcrumbItems.push({
        label: modelMeta.name,
        href: `/admin/${modelKey}`,
        isCurrent: pathSegments.length === 2
      });
    }
  }
  
  // Add action segment if exists (new, edit, etc.)
  if (pathSegments.length > 2) {
    const action = pathSegments[2];
    let actionLabel = action;
    
    switch (action) {
      case 'new':
        actionLabel = 'افزودن جدید';
        break;
      case 'edit':
        actionLabel = 'ویرایش';
        break;
      default:
        actionLabel = action;
    }
    
    breadcrumbItems.push({
      label: actionLabel,
      href: pathname,
      isCurrent: true
    });
  }
  
  // If we're editing a specific item, add the ID
  if (pathSegments.length > 3 && pathSegments[2] === 'edit') {
    const itemId = pathSegments[3];
    breadcrumbItems.push({
      label: `آیتم ${itemId}`,
      href: pathname,
      isCurrent: true
    });
  }
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage className="text-[var(--color-brand-500)] dark:text-[var(--color-brand-500)] font-medium flex gap-2 items-center">
                  {item.icon && <span className="ms-2">{item.icon}</span>}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex gap-2 items-center"
                  >
                    {item.icon && <span className="ms-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AdminBreadcrumb;
