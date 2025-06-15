
"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:animate-fade-in",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-accent group-[.toast]:text-accent-foreground group-[.toast]:transition-colors",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:transition-colors",
          title: "group-[.toast]:font-medium group-[.toast]:text-foreground",
          closeButton: "group-[.toast]:text-foreground/50 group-[.toast]:hover:text-foreground group-[.toast]:transition-colors"
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
