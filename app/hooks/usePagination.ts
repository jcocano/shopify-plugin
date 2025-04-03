import { useSearchParams } from '@remix-run/react';
import { useCallback } from 'react';

interface UsePaginationProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  offset: number;
  size: number;
  totalRecords: number;
}

export function usePagination({ 
  searchParams, 
  setSearchParams, 
  offset, 
  size, 
  totalRecords 
}: UsePaginationProps) {
  const currentOffset = Number(searchParams.get('offset')) || offset;
  const currentSize = Number(searchParams.get('size')) || size;

  const onNext = useCallback(() => {
    const nextOffset = currentOffset + currentSize;
    searchParams.set('offset', nextOffset.toString());
    setSearchParams(searchParams);
  }, [currentOffset, currentSize, searchParams, setSearchParams]);

  const onPrevious = useCallback(() => {
    const prevOffset = Math.max(0, currentOffset - currentSize);
    searchParams.set('offset', prevOffset.toString());
    setSearchParams(searchParams);
  }, [currentOffset, currentSize, searchParams, setSearchParams]);

  const hasNext = currentOffset + currentSize < totalRecords;
  const hasPrevious = currentOffset > 0;

  return {
    currentOffset,
    currentSize,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious
  };
} 