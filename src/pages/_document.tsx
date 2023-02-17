import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="scroll-smooth">
      <Head />
      <body className="transition-colors dark:bg-dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}