import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Strip from '@/components/Strip';
import Sobre from '@/components/Sobre';
import Servicos from '@/components/Servicos';
import BannerLuce from '@/components/BannerLuce';
import Galeria from '@/components/Galeria';
import Tecnologia from '@/components/Tecnologia';
import Depoimentos from '@/components/Depoimentos';
import Contato from '@/components/Contato';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <Sobre />
        <Servicos />
        <BannerLuce />
        <Galeria />
        <Tecnologia />
        <Depoimentos />
        <Contato />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
