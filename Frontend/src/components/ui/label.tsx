// "use client"

// import * as React from "react"
// import * as LabelPrimitive from "@radix-ui/react-label"

// import { cn } from "@/lib/utils"

// function Label({
//   className,
//   ...props
// }: React.ComponentProps<typeof LabelPrimitive.Root>) {
//   return (
//     <LabelPrimitive.Root
//       data-slot="label"
//       className={cn(
//         "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Label }



// import * as React from "react";

// export function Label({ children, htmlFor, className="" }:{children:React.ReactNode; htmlFor?:string; className?:string;}) {
//   return <label htmlFor={htmlFor} className={`block text-sm mb-1 text-[var(--muted)] ${className}`}>{children}</label>;
// }


import * as React from "react";

interface LabelProps {
  children?: React.ReactNode; // <-- optional now
  htmlFor?: string;
  className?: string;
}

export function Label({ children, htmlFor, className = "" }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm mb-1 text-[var(--muted)] ${className}`}
    >
      {children}
    </label>
  );
}
