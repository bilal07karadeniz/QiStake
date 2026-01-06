import { Header, Footer } from '@/components/layout';
import { Hero, Stats, Features, HowItWorks, CTA } from '@/components/landing';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
