/**
 * OVERLAY COMPONENT
 * =================
 * FILE: src/components/ui/Overlay.jsx
 *
 * WHAT THIS IS:
 *   The semi-transparent dark background that appears
 *   behind the cart drawer, wishlist drawer, modals, etc.
 *   Clicking it closes everything.
 *
 * HOW IT WORKS:
 *   It fades in when any drawer/modal is open,
 *   and closes everything when clicked.
 */

import { useUI } from '../../store/UIContext'

export default function Overlay() {
  const { anyDrawerOpen, closeAllDrawers } = useUI()

  return (
    <div
      aria-hidden="true"
      onClick={closeAllDrawers}
      className={`
        fixed inset-0 z-[1000]
        bg-deep-heaven/50 backdrop-blur-sm
        transition-opacity duration-300
        ${anyDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    />
  )
}
