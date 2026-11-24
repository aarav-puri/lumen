/** Joins class names, skipping falsy values. Used by the 21st.dev components. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
