import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lease Buyout Calculator | See How Much You Could Save',
  description: 'Estimate tax savings and break-even offer on your vehicle lease buyout in under a minute.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
