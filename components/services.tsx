import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Baby, Users, Waves, Trophy, Clock, Heart } from "lucide-react"

const services = [
  {
    icon: Baby,
    title: "Clases para Bebés",
    description: "Introducción al agua para los más pequeños (6 meses - 3 años) con actividades lúdicas y seguras.",
    features: ["Estimulación temprana", "Padres en el agua", "Grupos reducidos"]
  },
  {
    icon: Users,
    title: "Clases Infantiles",
    description: "Programas estructurados para niños de 4 a 12 años, desde principiantes hasta avanzados.",
    features: ["Niveles progresivos", "Técnicas de natación", "Juegos acuáticos"]
  },
  {
    icon: Waves,
    title: "Clases para Adultos",
    description: "Nunca es tarde para aprender. Clases adaptadas a tu ritmo y necesidades.",
    features: ["Horarios flexibles", "Atención personalizada", "Sin presión"]
  },
  {
    icon: Trophy,
    title: "Entrenamiento Competitivo",
    description: "Para quienes buscan perfeccionar su técnica y participar en competencias.",
    features: ["Preparación física", "Técnica avanzada", "Competencias"]
  },
  {
    icon: Clock,
    title: "Acceso a Piscina",
    description: "Membresías para uso libre de nuestras instalaciones en horarios establecidos.",
    features: ["Nado libre", "Carriles exclusivos", "Vestuarios completos"]
  },
  {
    icon: Heart,
    title: "Aquagym y Rehabilitación",
    description: "Ejercicios acuáticos para mejorar tu salud y recuperarte de lesiones.",
    features: ["Bajo impacto", "Fortalecimiento", "Rehabilitación"]
  }
]

export function Services() {
  return (
    <section id="servicios" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una amplia variedad de programas acuáticos diseñados para 
            satisfacer las necesidades de toda la familia.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
