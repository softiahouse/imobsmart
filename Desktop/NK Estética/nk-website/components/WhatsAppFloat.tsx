export default function WhatsAppFloat() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP ?? '34621661700';
  return (
    <a
      href={`https://wa.me/${wa}?text=${encodeURIComponent('Hola! Quiero obtener información sobre los tratamientos de NK Medicina Estética. Vengo desde vuestro sitio web 🌿')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white text-2xl shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_32px_rgba(37,211,102,0.7)] transition-shadow duration-200 animate-[waPulse_2s_infinite]"
    >
      💬
    </a>
  );
}
