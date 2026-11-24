import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Landing from '@/components/home/Landing'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Landing />
      </main>
      <Footer />
    </>
  )
}
