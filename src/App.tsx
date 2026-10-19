import { Route, Routes } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { Inicio } from '@/pages/Inicio';
import { Tienda } from '@/pages/Tienda';
import { Producto } from '@/pages/Producto';
import { Checkout } from '@/pages/Checkout';
import { PedidoConfirmado } from '@/pages/PedidoConfirmado';
import { Nosotros } from '@/pages/Nosotros';
import { Ayuda } from '@/pages/Ayuda';
import { NoEncontrado } from '@/pages/NoEncontrado';

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Inicio />} />
      <Route path="tienda" element={<Tienda />} />
      <Route path="tienda/:categoria" element={<Tienda />} />
      <Route path="producto/:slug" element={<Producto />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="pedido-confirmado" element={<PedidoConfirmado />} />
      <Route path="nosotros" element={<Nosotros />} />
      <Route path="ayuda" element={<Ayuda />} />
      <Route path="*" element={<NoEncontrado />} />
    </Route>
  </Routes>
);
