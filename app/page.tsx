import Footer from './components/landing/Footer';
import Landing from './components/landing/Landing';
import Navbar from './components/landing/Navbar';

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-black">
        <Navbar />
        <main className="flex-1">
          <Landing />
        </main>
        <Footer />
      </div>
    </>
  );
}
