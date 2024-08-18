import Image from 'next/image'
import Navbar from './components/Navbar'
import Body from './components/Body'
import Footer from './components/Footer'
export default function Home() {
  return (
    <main>
      <Navbar />
      <Body />
      <Footer />
    </main>
  )
}
