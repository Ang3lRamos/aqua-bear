"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

const services = [
  { value: "baby", label: "Clases para Bebés (6m - 3 años)" },
  { value: "kids", label: "Clases Infantiles (4 - 12 años)" },
  { value: "adult", label: "Clases para Adultos" },
  { value: "competitive", label: "Entrenamiento Competitivo" },
  { value: "membership", label: "Membresía - Acceso a Piscina" },
  { value: "aquagym", label: "Aquagym / Rehabilitación" },
]

const allTimeSlots = [
  { value: "06:00", label: "6:00 AM", hour: 6 },
  { value: "07:00", label: "7:00 AM", hour: 7 },
  { value: "08:00", label: "8:00 AM", hour: 8 },
  { value: "09:00", label: "9:00 AM", hour: 9 },
  { value: "10:00", label: "10:00 AM", hour: 10 },
  { value: "11:00", label: "11:00 AM", hour: 11 },
  { value: "12:00", label: "12:00 PM", hour: 12 },
  { value: "13:00", label: "1:00 PM", hour: 13 },
  { value: "14:00", label: "2:00 PM", hour: 14 },
  { value: "15:00", label: "3:00 PM", hour: 15 },
  { value: "16:00", label: "4:00 PM", hour: 16 },
  { value: "17:00", label: "5:00 PM", hour: 17 },
  { value: "18:00", label: "6:00 PM", hour: 18 },
  { value: "19:00", label: "7:00 PM", hour: 19 },
  { value: "20:00", label: "8:00 PM", hour: 20 },
  { value: "21:00", label: "9:00 PM", hour: 21 },
]

export function Booking() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    time: "",
    participants: "1",
    notes: ""
  })

  // Scroll to section when success message appears
  useEffect(() => {
    if (isSuccess && sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }, [isSuccess])

  // Filtrar horarios disponibles basado en la fecha seleccionada
  const availableTimeSlots = useMemo(() => {
    if (!date) return allTimeSlots
    
    const today = new Date()
    const selectedDate = new Date(date)
    
    // Comparar solo las fechas sin hora
    const isToday = selectedDate.toDateString() === today.toDateString()
    
    if (!isToday) return allTimeSlots
    
    // Si es hoy, solo mostrar horas futuras (al menos 1 hora despues)
    const currentHour = today.getHours()
    return allTimeSlots.filter(slot => slot.hour > currentHour)
  }, [date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    if (!date) {
      setError("Por favor selecciona una fecha")
      setIsSubmitting(false)
      return
    }

    if (!formData.time) {
      setError("Por favor selecciona un horario")
      setIsSubmitting(false)
      return
    }

    if (!formData.service) {
      setError("Por favor selecciona un tipo de servicio")
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()
      
      const { error: insertError } = await supabase
        .from('reservations')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.service,
          reservation_date: date.toISOString().split('T')[0],
          reservation_time: formData.time,
          participants: parseInt(formData.participants),
          notes: formData.notes || null,
          status: 'pending'
        })

      if (insertError) throw insertError
      
      // Enviar notificacion por correo al admin
      const serviceName = services.find(s => s.value === formData.service)?.label || formData.service
      const dateFormatted = date.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
      
      try {
        await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            service: serviceName,
            date: dateFormatted,
            time: formData.time,
            participants: formData.participants,
            notes: formData.notes
          })
        })
      } catch (emailError) {
        // Si falla el correo, no bloquear la reserva
        console.error('Error sending notification email:', emailError)
      }
      
      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        time: "",
        participants: "1",
        notes: ""
      })
      setDate(undefined)
    } catch (err) {
      console.error('[v0] Reservation error:', err)
      setError("Hubo un error al procesar tu reserva. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section ref={sectionRef} id="reservas" className="py-20 bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-accent/50">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¡Reserva Recibida!
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Hemos recibido tu solicitud de reserva. Nos pondremos en contacto 
                contigo pronto para confirmar los detalles.
              </p>
              <Button onClick={() => setIsSuccess(false)} size="lg">
                Hacer Otra Reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="reservas" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Reserva tu Clase
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecciona la fecha, horario y tipo de clase que deseas. 
            Nos pondremos en contacto para confirmar tu reserva.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Selecciona Fecha y Hora
              </CardTitle>
              <CardDescription>
                Elige el día y horario que mejor te convenga
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    // Reset time when date changes to avoid invalid selection
                    setFormData(prev => ({ ...prev, time: "" }))
                  }}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today || date.getDay() === 0
                  }}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Horario Preferido
                </Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un horario" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No hay horarios disponibles para hoy
                      </div>
                    ) : (
                      availableTimeSlots.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>
                Completa tus datos para procesar la reserva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Tipo de Servicio</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participants">Número de Participantes</Label>
                  <Select
                    value={formData.participants}
                    onValueChange={(value) => setFormData({ ...formData, participants: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "persona" : "personas"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Información adicional que debamos saber..."
                    rows={3}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Solicitar Reserva"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}