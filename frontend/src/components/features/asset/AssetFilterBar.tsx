'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CategoryResponse } from '@/lib/api/api.type';
import { useQueryFilter } from '@/lib/hooks/useQueryFilter';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const ALL_CATEGORIES = 'ALL';

type AssetFilterBarProps = {
  categories: CategoryResponse[];
};

export default function AssetFilterBar({ categories }: AssetFilterBarProps) {
  const { setParam, getParam } = useQueryFilter();
  const currentSearch = getParam('search');
  const currentCategory = getParam('categoryId');

  const [search, setSearch] = useState(currentSearch);

  // หน่วงไว้ 300ms ค่อยยิง API จะได้ไม่ยิงทุกตัวอักษรที่พิมพ์
  useEffect(() => {
    if (search === currentSearch) return;

    const timer = setTimeout(() => setParam('search', search || null), 300);
    return () => clearTimeout(timer);
  }, [search, currentSearch, setParam]);

  const categoryLabels: Record<string, string> = {
    [ALL_CATEGORIES]: 'ทุกหมวดหมู่',
    ...Object.fromEntries(
      categories.map((category) => [category.id, category.name])
    )
  };

  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative min-w-56 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="ค้นหาจากชื่ออุปกรณ์..."
          aria-label="ค้นหาอุปกรณ์"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select
        items={categoryLabels}
        value={currentCategory || ALL_CATEGORIES}
        onValueChange={(value: string | null) =>
          setParam('categoryId', !value || value === ALL_CATEGORIES ? null : value)
        }
      >
        <SelectTrigger className="min-w-44" aria-label="กรองตามหมวดหมู่">
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value={ALL_CATEGORIES}>ทุกหมวดหมู่</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
