export const metadata = {
  title: 'BeKreative Pinterest',
  description: 'Genera contenuto pin per Pinterest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
