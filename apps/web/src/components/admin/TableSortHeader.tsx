'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

interface TableSortHeaderProps<T extends string> {
  label: string;
  field: T;
  currentField: T | null;
  direction: SortDirection;
  onSort: (field: T) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function TableSortHeader<T extends string>({
  label,
  field,
  currentField,
  direction,
  onSort,
  className = '',
  align = 'left',
}: TableSortHeaderProps<T>) {
  const isActive = currentField === field;

  return (
    <th
      onClick={() => onSort(field)}
      className={`py-3.5 px-4 cursor-pointer hover:bg-stone-100/80 transition-colors select-none group text-[10px] font-extrabold uppercase tracking-wider text-stone-700 ${className}`}
      title={`Urutkan berdasarkan ${label} (${isActive && direction === 'asc' ? 'Z-A / Terbesar' : 'A-Z / Terkecil'})`}
    >
      <div
        className={`flex items-center gap-1.5 ${
          align === 'center'
            ? 'justify-center'
            : align === 'right'
            ? 'justify-end'
            : 'justify-start'
        }`}
      >
        <span className={isActive ? 'text-rose-600 font-black' : ''}>{label}</span>
        <span className="inline-flex items-center shrink-0">
          {isActive ? (
            direction === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 text-stone-300 group-hover:text-stone-500 transition-colors" />
          )}
        </span>
      </div>
    </th>
  );
}
