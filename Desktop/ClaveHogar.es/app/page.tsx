import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import QuienesSomos from "./components/QuienesSomos";
import Servicios from "./components/Servicios";
import Paquetes from "./components/Paquetes";
import Testimonios from "./components/Testimonios";
import LeadForm from "./components/LeadForm";
import PorQueElegirnos from "./components/PorQueElegirnos";
import Contacto from "./components/Contacto";
import Footer from "./components/Footer";
import WhatsAppFAB from "./components/WhatsAppFAB";
import PWAInstallButton from "./components/PWAInstallButton";
import PromoSofa from "./components/PromoSofa";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PromoSofa />
        <QuienesSomos />
        <Servicios />
        <Paquetes />
        <Testimonios />
        <LeadForm />
        <PorQueElegirnos />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppFAB />
      <PWAInstallButton />
    </>
  );
}
