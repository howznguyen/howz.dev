import {ThemeProvider} from 'next-themes'
import '@/styles/globals.css';
import "react-medium-image-zoom/dist/styles.css";
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  </>
}
