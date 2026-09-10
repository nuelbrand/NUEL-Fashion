/**
 * TOAST COMPONENT
 * ===============
 * FILE: src/components/ui/Toast.jsx
 *
 * WHAT THIS IS:
 *   The small notification bar that slides up from the bottom
 *   of the screen when something happens, like "Added to cart"
 *   or "Removed from wishlist".
 *
 *   It disappears automatically after 2.5 seconds.
 *
 * HOW TO TRIGGER IT:
 *   import { useUI } from '../../store/UIContext'
 *   const { showToast } = useUI()
 *   showToast('Added to cart!')
 *
 * PROPS: none — it reads directly from UIContext
 */

import { useUI } from '../../store/UIContext'

export default function Toast() {
  const { toast } = useUI()

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[1500]
        bg-deep-heaven text-white
        px-6 py-3 rounded-full
        text-sm font-medium
        shadow-xl whitespace-nowrap
        pointer-events-none
        transition-all duration-300
        ${toast.visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-24 opacity-0'
        }
      `}
    >
      {toast.message}
    </div>
  )
}
