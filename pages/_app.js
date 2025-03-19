import "@/styles/globals.css";
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <main className={spaceGrotesk.className}>
      <Component {...pageProps} />
    </main>
  );
}
