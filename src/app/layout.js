import './globals.css'

export const metadata = {
  title: 'CLATEC — Legal Intelligence for Tokenization & Digital Assets',
  description: 'Structured preliminary legal guidance for blockchain projects, token issuance, MiCA, CASP, sandbox applications, and cross-border digital asset structuring.',
  keywords: 'tokenization, digital assets, MiCA, CASP, blockchain, legal, compliance, sandbox, DLT',
  openGraph: {
    title: 'CLATEC — Legal Intelligence for Tokenization & Digital Assets',
    description: 'Structured preliminary legal guidance for blockchain projects.',
    url: 'https://clatec.consulting',
    siteName: 'CLATEC',
    type: 'website',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
