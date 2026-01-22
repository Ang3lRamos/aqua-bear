import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Instagram, Mail } from "lucide-react"

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
  }
]

const contactInfo = [
  {
    icon: Phone,
    label: "+52 1 729 975 0855",
    href: "https://wa.me/5217299750855"
  },
  {
    icon: Instagram,
    label: "@aquabear_mx",
    href: "https://www.instagram.com/aquabear_mx"
  },
  {
    icon: MapPin,
    label: "Medellín, Antioquia",
    href: "#contacto"
  }
]

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/images/image.png"
                alt="Aqua Bear Swim Club"
                width={48}
                height={48}
                className="rounded-full bg-white"
              />
              <span className="text-lg font-bold">Aqua Bear</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Tu club de natación familiar con instructores certificados.
            </p>
          </div>
          
          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-3 text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contacto</h4>
            <ul className="space-y-2">
              {contactInfo.map((contact) => (
                <li key={contact.label}>
                  <Link 
                    href={contact.href}
                    className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm group"
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <contact.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{contact.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-primary-foreground/60 text-center sm:text-left">
            © {new Date().getFullYear()} Aqua Bear Swim Club. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}