'use client'

import { CartProvider } from "@/contexts/CartContext"
import { ChatProvider } from "@/contexts/ChatContext"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </CartProvider>
    </SessionProvider>
  )
}
