import Image from "next/image"
import Link from "next/link"

const footerLinks = [
  {
    title: "Servicios",
    links: [
      { label: "Clases para Bebés", href: "#servicios" },
      { label: "Clases Infantiles", href: "#servicios" },
      { label: "Clases para Adultos", href: "#servicios" },
      { label: "Membresías", href: "#servicios" },
    ]
  },
  {
    title: "Club",
    links: [
      { label: "Sobre Nosotros", href: "#nosotros" },
      { label: "Instructores", href: "#nosotros" },
      { label: "Instalaciones", href: "#nosotros" },
      { label: "Horarios", href: "#contacto" },
    ]
  },
  {
    title: "Contacto",
    links: [
      { label: "WhatsApp", href: "https://wa.me/5217299750855" },
      { label: "Instagram", href: "https://www.instagram.com/aquabear_mx" },
      { label: "Reservas", href: "#reservas" },
      { label: "Ubicación", href: "#contacto" },
    ]
  }
]

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/images/image.png"
                alt="Aqua Bear Swim Club"
                width={56}
                height={56}
                className="rounded-full bg-white"
              />
              <span className="text-xl font-bold">Aqua Bear Swim Club</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-sm">
              Tu club de natación familiar. Ofrecemos clases para todas las edades 
              con instructores certificados y un ambiente seguro y divertido.
            </p>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            {new Date().getFullYear()} Aqua Bear Swim Club. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
