import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, MessageCircle, Instagram } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+52 1 729 975 0855",
    href: "https://wa.me/5217299750855"
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@aquabear_mx",
    href: "https://www.instagram.com/aquabear_mx"
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: "Av. Principal #123, Ciudad",
    href: "#"
  },
  {
    icon: Clock,
    label: "Horarios",
    value: "Lun - Sáb: 6:00 - 21:00",
    href: null
  }
];

export function Contact() {
  const whatsappMessage = encodeURIComponent("¡Hola! Me gustaría obtener más información sobre las clases de natación en Aqua Bear Swim Club.");
  const whatsappUrl = `https://wa.me/5217299750855?text=${whatsappMessage}`;
  const instagramUrl = "https://www.instagram.com/aquabear_mx";

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Contáctanos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas? Estamos aquí para ayudarte. Contáctanos por 
            WhatsApp o síguenos en Instagram.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* WhatsApp Card - Clickeable */}
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white border-0 h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">WhatsApp</h3>
                <p className="mb-6 opacity-90">
                  Escríbenos por WhatsApp para una respuesta rápida. 
                  Estamos disponibles de lunes a sábado.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[#25D366] hover:bg-white/90 transition-all duration-300 group-hover:shadow-lg"
                  asChild
                >
                  <span>Enviar Mensaje</span>
                </Button>
              </CardContent>
            </Card>
          </a>

          {/* Instagram Card - Clickeable */}
          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 text-white border-0 h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Instagram className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Instagram</h3>
                <p className="mb-6 opacity-90">
                  Síguenos en Instagram para ver fotos, videos 
                  y las últimas novedades de nuestro club.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-white/90 transition-all duration-300 group-hover:shadow-lg"
                  asChild
                >
                  <span>@aquabear_mx</span>
                </Button>
              </CardContent>
            </Card>
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {contactInfo.map((info) => {
            const CardWrapper = info.href ? 'a' : 'div';
            const cardProps = info.href ? {
              href: info.href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block group"
            } : {
              className: "block"
            };

            return (
              <CardWrapper key={info.label} {...cardProps}>
                <Card className={`text-center h-full transition-all duration-300 ${info.href ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : ''}`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ${info.href ? 'group-hover:scale-110 group-hover:bg-primary/20' : ''}`}>
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{info.label}</h4>
                    <p className={`text-sm text-muted-foreground ${info.href ? 'group-hover:text-primary transition-colors' : ''}`}>
                      {info.value}
                    </p>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}