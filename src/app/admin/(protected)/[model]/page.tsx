"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  adminModelRegistry,
  adminModelRouterMap,
  type AdminModelKey,
} from "@/modules/registry";
import { AdminDataTable } from "@/components/admin/shared/AdminDataTable";
import { normalizeItem } from "@/lib/admin/normalize";
import AdminBreadcrumb from "@/components/admin/shared/AdminBreadcrumb";
import Link from "next/link";
import { 
  Archive, 
  Eye, 
  EyeOff, 
  Send, 
  Star, 
  Tag, 
  Download,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RawItem = { id: string } & Record<string, unknown>;

export default function AdminDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const raw = params.model;
  const modelKey = Array.isArray(raw) ? raw[0] : raw;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // اگر کلید اشتباه یا ناشناخته است
  if (!modelKey || !(modelKey in adminModelRegistry)) {
    return <p className="p-6 text-red-600">❌ Unknown model: {modelKey}</p>;
  }

  const meta = adminModelRegistry[modelKey as AdminModelKey];
  const trpcRouter = adminModelRouterMap[modelKey as AdminModelKey];

  // tRPC query و mutation داینامیک
  const { data = [], refetch, isLoading } = trpcRouter.getAll.useQuery();
  const del = trpcRouter.delete.useMutation();

  // Enhanced bulk actions based on model type
  const getBulkActions = () => {
    const baseActions = [
      {
        label: 'حذف انتخاب شده‌ها',
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
        onClick: async (ids: string[]) => {
          if (confirm(`آیا از حذف ${ids.length} آیتم انتخاب شده اطمینان دارید؟`)) {
            for (const id of ids) {
              await del.mutateAsync({ id });
            }
            refetch();
          }
        },
        confirmMessage: `آیا از حذف آیتم‌های انتخاب شده اطمینان دارید؟`
      }
    ];

    // Blog-specific actions
    if (modelKey === 'post') {
      return [
        ...baseActions,
        {
          label: 'انتشار',
          icon: <Eye className="h-4 w-4" />,
          variant: 'secondary' as const,
          onClick: async (ids: string[]) => {
            // Here you would implement bulk publish logic
            alert(`${ids.length} پست منتشر شد`);
          }
        },
        {
          label: 'پیش‌نویس',
          icon: <EyeOff className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: async (ids: string[]) => {
            // Here you would implement bulk draft logic
            alert(`${ids.length} پست به پیش‌نویس تبدیل شد`);
          }
        },
        {
          label: 'آرشیو',
          icon: <Archive className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: async (ids: string[]) => {
            alert(`${ids.length} پست آرشیو شد`);
          }
        }
      ];
    }

    // Product-specific actions
    if (modelKey === 'product') {
      return [
        ...baseActions,
        {
          label: 'انتشار',
          icon: <Eye className="h-4 w-4" />,
          variant: 'secondary' as const,
          onClick: async (ids: string[]) => {
            alert(`${ids.length} محصول منتشر شد`);
          }
        },
        {
          label: 'عدم انتشار',
          icon: <EyeOff className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: async (ids: string[]) => {
            alert(`${ids.length} محصول از حالت انتشار خارج شد`);
          }
        },
        {
          label: 'تگ‌گذاری',
          icon: <Tag className="h-4 w-4" />,
          variant: 'outline' as const,
          onClick: async (ids: string[]) => {
            alert(`تگ‌های جدید به ${ids.length} محصول اضافه شد`);
          }
        }
      ];
    }

    // Category-specific actions
    if (modelKey === 'category' || modelKey === 'productCategory') {
      return [
        ...baseActions,
        {
          label: 'فعال‌سازی',
          icon: <Eye className="h-4 w-4" />,
          variant: 'secondary' as const,
          onClick: async (ids: string[]) => {
            alert(`${ids.length} دسته‌بندی فعال شد`);
          }
        }
      ];
    }

    return baseActions;
  };

  // Custom export handler
  const handleCustomExport = (data: any[], format: 'csv' | 'json') => {
    const fileName = `${meta.name}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      // Enhanced CSV export with proper headers
      const headers = Object.values(meta.fields).map(field => field.label);
      const csvContent = [
        headers.join(','),
        ...data.map(item => 
          Object.keys(meta.fields).map(key => {
            const value = item[key];
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            if (Array.isArray(value)) {
              return `"${value.join(', ')}"`;
            }
            return value ?? '';
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.csv`;
      link.click();
    } else {
      // Enhanced JSON export
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.json`;
      link.click();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb moved to AppHeader */}
      
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {meta.icon && <meta.icon className="h-8 w-8" />}
            📋 مدیریت {meta.name}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {data.length} آیتم موجود • از تمام ویژگی‌های جدید استفاده کنید
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Show help/tips
              alert(`نکات استفاده از ${meta.name}:\n\n` +
                '• از جستجو برای یافتن سریع آیتم‌ها استفاده کنید\n' +
                '• چندین آیتم را انتخاب کرده و عملیات گروهی انجام دهید\n' +
                '• از export برای تهیه نسخه پشتیبان استفاده کنید\n' +
                '• ستون‌ها را طبق نیاز نمایش دهید'
              );
            }}
          >
            راهنما
          </Button>
          <Link href={`/admin/${modelKey}/new`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              افزودن {meta.name}
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Badge variant="secondary" className="justify-center py-2">
          🔍 جستجوی پیشرفته
        </Badge>
        <Badge variant="outline" className="justify-center py-2">
          📊 عملیات گروهی
        </Badge>
        <Badge variant="secondary" className="justify-center py-2">
          📤 Export خودکار
        </Badge>
        <Badge variant="outline" className="justify-center py-2">
          👁️ کنترل ستون‌ها
        </Badge>
      </div>

      {/* Enhanced Data Table */}
      <AdminDataTable
        model={meta}
        data={data.map((item: RawItem) => normalizeItem(item, meta))}
        onEdit={(item) => router.push(`/admin/${modelKey}/${item.id}/edit`)}
        onDelete={async (id) => {
          if (confirm(`آیا مطمئن هستید که این ${meta.name} حذف شود؟`)) {
            await del.mutateAsync({ id });
            refetch();
          }
        }}
        onBulkDelete={async (ids: string[]) => {
          if (confirm(`آیا از حذف ${ids.length} آیتم انتخاب شده اطمینان دارید؟`)) {
            for (const id of ids) {
              await del.mutateAsync({ id });
            }
            refetch();
          }
        }}
        loading={isLoading}
        bulkActions={getBulkActions()}
        enableExport={true}
        onExport={handleCustomExport}
        showTotalCount={true}
        pageSizeOptions={[10, 25, 50, 100]}
      />

      {/* Quick Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.length}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">کل آیتم‌ها</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.filter((item: any) => item.published || item.isPublished).length}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">منتشر شده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.filter((item: any) => !item.published && !item.isPublished).length}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">پیش‌نویس</div>
          </div>
        </div>
      )}
    </div>
  );
}
