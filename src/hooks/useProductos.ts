import { useQuery } from '@tanstack/react-query';
import { fetchProducto, fetchProductos } from '@/services/productos';

export const useProductos = () =>
  useQuery({ queryKey: ['productos'], queryFn: fetchProductos, staleTime: Infinity });

export const useProducto = (slug: string) =>
  useQuery({ queryKey: ['producto', slug], queryFn: () => fetchProducto(slug), staleTime: Infinity });
