import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const highlights = [
  "Instructores certificados y apasionados",
  "Instalaciones modernas y seguras",
  "Grupos reducidos para atención personalizada",
  "Programas adaptados a cada nivel y edad",
  "Ambiente familiar y acogedor",
  "Seguimiento del progreso de cada estudiante"
]

export function About() {
  return (
    <section id="nosotros" className="relative py-40 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/team.png"
          alt="Equipo Aqua Bear Swim Club"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Sobre Aqua Bear Swim Club
          </h2>
          <p className="text-lg text-white/90 mb-6">
            Somos un club de natación familiar comprometido con la enseñanza de calidad 
            y la seguridad acuática. Acabamos de abrir nuestras puertas con mucha ilusión 
            para ayudarte a descubrir el placer de nadar.
          </p>
          <p className="text-white/80 mb-8">
            Nuestro equipo de instructores profesionales está dedicado a crear 
            un ambiente de aprendizaje positivo donde cada estudiante puede 
            desarrollar sus habilidades a su propio ritmo.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span className="text-sm text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
