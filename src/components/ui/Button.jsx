/**
 * BUTTON COMPONENT
 * ================
 * FILE: src/components/ui/Button.jsx
 *
 * WHAT THIS IS:
 *   A reusable button with NUEL brand styling.
 *   Instead of writing Tailwind classes on every button,
 *   we use this component with a simple "variant" prop.
 *
 * VARIANTS:
 *   primary  → Dark blue filled button (main actions)
 *   outline  → Blue border, transparent background
 *   ghost    → Subtle border, light hover
 *   danger   → Red (for destructive actions like "Remove")
 *
 * HOW TO USE:
 *   <Button variant="primary" onClick={handleClick}>Add to Cart</Button>
 *   <Button variant="outline" size="lg">Shop Women</Button>
 *   <Button variant="ghost" className="w-full">Continue Shopping</Button>
 *
 * PROPS:
 *   variant   - 'primary' | 'outline' | 'ghost' | 'danger'  (default: 'primary')
 *   size      - 'sm' | 'md' | 'lg'                          (default: 'md')
 *   fullWidth - boolean, makes button 100% wide
 *   disabled  - boolean, disables button
 *   className - extra Tailwind classes
 *   onClick   - click handler
 *   type      - 'button' | 'submit' (default: 'button')
 *   children  - button label / content
 */

const variants = {
  primary: `
    bg-covenant text-white border-2 border-covenant
    hover:bg-deep-heaven hover:border-deep-heaven
    active:scale-[0.98]
  `,
  outline: `
    bg-transparent text-covenant border-2 border-covenant
    hover:bg-covenant hover:text-white
    active:scale-[0.98]
  `,
  ghost: `
    bg-transparent text-gray-600 dark:text-gray-300
    border-2 border-gray-200 dark:border-gray-600
    hover:bg-covenant/10 hover:text-covenant hover:border-covenant
    active:scale-[0.98]
  `,
  danger: `
    bg-transparent text-brand-error border-2 border-brand-error
    hover:bg-brand-error hover:text-white
    active:scale-[0.98]
  `,
}

const sizes = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export default function Button({
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  disabled  = false,
  className = '',
  onClick,
  type      = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-content-center gap-2
        font-semibold rounded-full
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-covenant focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full justify-center' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  )
}
