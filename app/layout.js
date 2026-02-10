import './globals.css'

export const metadata = {
  title: 'Data Center Feed',
  description: 'Your personalized RSS feed aggregator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
