/**
 * Desplazamiento suave salvo que el usuario haya pedido reducir el movimiento en su sistema.
 * `behavior: 'smooth'` en JavaScript ignora la regla CSS de styles.css, por eso se decide aquí.
 */
export function scrollBehavior(): ScrollBehavior {
  return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
