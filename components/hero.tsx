import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Waves } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/30" />
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Waves size={16} />
            <span>Club de Natación para Toda la Familia</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
            Aprende a nadar con{" "}
            <span className="text-primary">confianza</span> y{" "}
            <span className="text-accent">diversión</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            En Aqua Bear Swim Club ofrecemos clases de natación para todas las edades, 
            desde bebés hasta adultos. Nuestros instructores certificados te guiarán 
            en cada brazada hacia tus metas acuáticas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#reservas">Reservar Clase de Prueba</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#servicios">Ver Servicios</Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-10 pt-10 border-t border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">6</p>
              <p className="text-sm text-muted-foreground">Instructores</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">Todas</p>
              <p className="text-sm text-muted-foreground">las Edades</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Compromiso</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
