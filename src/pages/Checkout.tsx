import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Lock } from 'lucide-react';
import { ENVIOS } from '@/config/tienda';
import { useCarrito } from '@/context/CarritoContext';
import { formatPrecio } from '@/lib/formato';
import { crearNumeroPedido, type DatosPedido, type Pedido } from '@/lib/pedido';

export const PEDIDO_STORAGE_KEY = 'tree-ultimo-pedido';

const Campo = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold">{label}</span>
    {children}
    {error && <span className="mt-1 block text-[13px] text-rojo">{error}</span>}
  </label>
);

export const Checkout = () => {
  const { items, subtotal, vaciar } = useCarrito();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DatosPedido>({ defaultValues: { envio: 'retiro' } });

  const envio = watch('envio');
  const requiereDireccion = envio !== 'retiro';

  if (items.length === 0) {
    return (
      <section className="wrap py-24 text-center">
        <h1 className="display mb-4 text-6xl">Tu carrito está vacío</h1>
        <p className="mb-8 text-gris">Agregá productos para finalizar la compra.</p>
        <Link to="/tienda" className="btn btn-rojo">Ir a la tienda</Link>
      </section>
    );
  }

  const onSubmit = (datos: DatosPedido) => {
    const pedido: Pedido = { numero: crearNumeroPedido(), fecha: new Date().toISOString(), datos, items, subtotal };
    try {
      sessionStorage.setItem(PEDIDO_STORAGE_KEY, JSON.stringify(pedido));
    } catch {
      // sin storage la confirmación igual recibe el pedido por state
    }
    vaciar();
    navigate('/pedido-confirmado', { state: pedido, replace: true });
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="wrap">
        <h1 className="display mb-10 text-[clamp(48px,7vw,88px)]">Finalizar compra</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1.3fr_1fr]" noValidate>
          <div className="space-y-10">
            <fieldset className="space-y-4">
              <legend className="display mb-4 text-3xl">1. Tus datos</legend>
              <Campo label="Nombre y apellido" error={errors.nombre?.message}>
                <input className="input" autoComplete="name" {...register('nombre', { required: 'Completá tu nombre' })} />
              </Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Email" error={errors.email?.message}>
                  <input
                    className="input"
                    type="email"
                    autoComplete="email"
                    {...register('email', { required: 'Completá tu email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email inválido' } })}
                  />
                </Campo>
                <Campo label="Teléfono" error={errors.telefono?.message}>
                  <input
                    className="input"
                    type="tel"
                    autoComplete="tel"
                    {...register('telefono', { required: 'Completá tu teléfono', minLength: { value: 8, message: 'Teléfono inválido' } })}
                  />
                </Campo>
              </div>
            </fieldset>

            <fieldset>
              <legend className="display mb-4 text-3xl">2. Entrega</legend>
              <div className="space-y-3">
                {ENVIOS.map((e) => (
                  <label
                    key={e.id}
                    className={`flex cursor-pointer gap-4 rounded-2xl border-2 bg-white p-5 transition ${envio === e.id ? 'border-tinta' : 'border-transparent'}`}
                  >
                    <input type="radio" value={e.id} className="mt-1 h-4 w-4 accent-tinta" {...register('envio')} />
                    <span className="flex-1">
                      <span className="flex justify-between gap-4 font-semibold">
                        {e.nombre}
                        <span>{e.costo === 0 ? 'Gratis' : 'A cotizar'}</span>
                      </span>
                      <span className="mt-1 block text-sm text-gris">{e.detalle}</span>
                    </span>
                  </label>
                ))}
              </div>

              {requiereDireccion && (
                <div className="mt-5 grid gap-4 sm:grid-cols-[2fr_1.2fr_1fr]">
                  <Campo label="Dirección" error={errors.direccion?.message}>
                    <input className="input" autoComplete="street-address" {...register('direccion', { required: requiereDireccion && 'Completá la dirección' })} />
                  </Campo>
                  <Campo label="Localidad" error={errors.localidad?.message}>
                    <input className="input" autoComplete="address-level2" {...register('localidad', { required: requiereDireccion && 'Completá la localidad' })} />
                  </Campo>
                  <Campo label="Código postal" error={errors.codigoPostal?.message}>
                    <input className="input" autoComplete="postal-code" {...register('codigoPostal', { required: requiereDireccion && 'Completá el CP' })} />
                  </Campo>
                </div>
              )}
            </fieldset>

            <fieldset>
              <legend className="display mb-4 text-3xl">3. Notas</legend>
              <textarea className="input min-h-[100px]" placeholder="Algo que tengamos que saber (opcional)" {...register('notas')} />
            </fieldset>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 lg:sticky lg:top-28">
            <h2 className="display mb-5 text-3xl">Tu pedido</h2>
            <ul className="mb-5 divide-y divide-linea">
              {items.map((i) => (
                <li key={i.clave} className="flex gap-3 py-3">
                  <div className="relative h-16 w-16 flex-none rounded-lg bg-papel">
                    <img src={i.imagen} alt="" className="h-full w-full object-contain p-1" />
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-tinta px-1 text-[11px] font-bold text-white">{i.cantidad}</span>
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-semibold leading-snug">{i.nombre}</p>
                    <p className="text-gris">{[i.variante !== 'Única' ? i.variante : null, i.talle].filter(Boolean).join(' · ')}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrecio(i.precio * i.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-linea pt-4 text-[15px]">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrecio(subtotal)}</span></div>
              <div className="flex justify-between"><span>Envío</span><span>{envio === 'retiro' ? 'Gratis' : 'A cotizar'}</span></div>
              <div className="flex justify-between pt-2 text-xl font-bold"><span>Total</span><span>{formatPrecio(subtotal)}</span></div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-rojo mt-6 w-full">Confirmar pedido</button>
            <p className="mt-4 flex items-start gap-2 text-[13px] text-gris">
              <Lock size={14} className="mt-0.5 flex-none" />
              Al confirmar, te mostramos el resumen para enviarlo a la tienda. El pago online con Mercado Pago llega en la próxima etapa.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
};
