"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, Users, CheckCircle2, XCircle, Loader2, RefreshCw, ArrowLeft, LogOut, Bell, ChevronLeft, ChevronRight, CalendarDays, List, Phone, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  service_type: string
  reservation_date: string
  reservation_time: string
  participants: number
  notes: string | null
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

const serviceLabels: Record<string, string> = {
  baby: "Clases para Bebés",
  kids: "Clases Infantiles",
  adult: "Clases para Adultos",
  competitive: "Entrenamiento Competitivo",
  membership: "Membresía",
  aquagym: "Aquagym / Rehabilitación",
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmada", variant: "default" as const, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelada", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [newReservation, setNewReservation] = useState<Reservation | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
      } else {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const fetchReservations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching reservations:", error)
    } else {
      setReservations(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReservations()
    
    // Suscribirse a nuevas reservas en tiempo real
    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations'
        },
        (payload) => {
          const newRes = payload.new as Reservation
          setReservations(prev => [newRes, ...prev])
          setNewReservation(newRes)
          
          // Reproducir sonido de notificacion
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dlYh3aGR3iZeempmMfW5ncoCOmJmYjoF0aGt/jZeXlY2CdmtsfoqVl5aNg3drbnyIk5aUjIN4bW18iJOVk4yDeG5ufIiSlJKLgndubXyIkZOSi4J3b258h5CSkYqBd29ue4eQkZCJgXdvbnuHj5CPiYB3b257ho+Pjoh/d29teoeOjo2Hf3ZubXqGjo6NiH92bm16ho2NjIh/dm5teYaNjYyHfnZubHmGjIyLhn52bWx5hYyLi4Z+dW1seYWLiouFfnVtbHmFi4qKhH51bGx4hIuKiYR9dWxsd4SJiYmDfHRsbHeEiYiIg3x0a2x3hImIiIN8dGtrd4OIh4eCe3Rranb/')
            audio.volume = 0.5
            audio.play().catch(() => {})
          } catch {}
          
          // Ocultar notificacion despues de 10 segundos
          setTimeout(() => setNewReservation(null), 10000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendWhatsAppConfirmation = (reservation: Reservation, isConfirmed: boolean) => {
    const phone = reservation.phone.replace(/\D/g, '') // Limpiar numero
    const serviceName = serviceLabels[reservation.service_type] || reservation.service_type || "Clase"
    
    // Formatear fecha de forma segura
    let dateFormatted = "Fecha por confirmar"
    if (reservation.reservation_date) {
      try {
        const dateObj = new Date(reservation.reservation_date + "T00:00:00")
        if (!isNaN(dateObj.getTime())) {
          dateFormatted = dateObj.toLocaleDateString("es-MX", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }
      } catch {
        dateFormatted = reservation.reservation_date
      }
    }
    
    const timeFormatted = reservation.reservation_time || "Hora por confirmar"
    
    let message: string
    if (isConfirmed) {
      message = `Hola ${reservation.name}!\n\nTu reserva en *Aqua Bear Swim Club* ha sido *CONFIRMADA*.\n\n*Fecha:* ${dateFormatted}\n*Hora:* ${timeFormatted}\n*Servicio:* ${serviceName}\n*Participantes:* ${reservation.participants}\n\nTe esperamos! Si tienes alguna pregunta, no dudes en contactarnos.`
    } else {
      message = `Hola ${reservation.name},\n\nLamentamos informarte que tu reserva en *Aqua Bear Swim Club* no pudo ser confirmada.\n\n*Fecha solicitada:* ${dateFormatted}\n*Hora:* ${timeFormatted}\n*Servicio:* ${serviceName}\n\nPor favor contactanos para reprogramar o si tienes alguna pregunta.`
    }
    
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const updateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    setUpdating(id)
    const { error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id)
    
    if (error) {
      console.error("Error updating reservation:", error)
    } else {
      const reservation = reservations.find(r => r.id === id)
      if (reservation) {
        sendWhatsAppConfirmation(reservation, status === "confirmed")
      }
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      )
    }
    setUpdating(null)
  }

  const deleteReservation = async (id: string) => {
    setUpdating(id)
    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting reservation:", error)
    } else {
      setReservations(prev => prev.filter(r => r.id !== id))
    }
    setUpdating(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCreatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pendingCount = reservations.filter(r => r.status === "pending").length
  const confirmedCount = reservations.filter(r => r.status === "confirmed").length
  const cancelledCount = reservations.filter(r => r.status === "cancelled").length

  const filterByStatus = (status: string) => {
    if (status === "all") return reservations
    return reservations.filter(r => r.status === status)
  }

  // Funciones para el calendario
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const getReservationsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return reservations.filter(r => r.reservation_date === dateStr)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)

  const CalendarView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayReservations = getReservationsForDate(day)
          const hasReservations = dayReservations.length > 0
          const hasPending = dayReservations.some(r => r.status === "pending")
          const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString()
          
          return (
            <div
              key={day}
              className={`aspect-square border rounded-lg p-1 cursor-pointer transition-colors hover:bg-muted/50 ${
                isToday ? "border-primary bg-primary/5" : "border-border"
              } ${hasReservations ? "bg-muted/30" : ""}`}
              onClick={() => {
                if (hasReservations && dayReservations.length === 1) {
                  setSelectedReservation(dayReservations[0])
                }
              }}
            >
              <div className={`text-sm ${isToday ? "font-bold text-primary" : ""}`}>
                {day}
              </div>
              {hasReservations && (
                <div className="mt-1 space-y-0.5">
                  {dayReservations.slice(0, 2).map(res => (
                    <div
                      key={res.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedReservation(res)
                      }}
                      className={`text-xs truncate px-1 py-0.5 rounded cursor-pointer hover:opacity-80 ${
                        res.status === "pending" 
                          ? "bg-yellow-200 text-yellow-800" 
                          : res.status === "confirmed"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                      title={`${res.name} - ${res.reservation_time}`}
                    >
                      {res.reservation_time?.slice(0, 5)}
                    </div>
                  ))}
                  {dayReservations.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayReservations.length - 2} mas
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const ReservationTable = ({ data }: { data: Reservation[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Participantes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay reservas en esta categoría
              </TableCell>
            </TableRow>
          ) : (
            data.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{reservation.name}</p>
                    <p className="text-sm text-muted-foreground">{reservation.email}</p>
                    <p className="text-sm text-muted-foreground">{reservation.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{serviceLabels[reservation.service_type] || reservation.service_type}</p>
                  {reservation.notes && (
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs truncate" title={reservation.notes}>
                      {reservation.notes}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{reservation.reservation_time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{reservation.participants}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[reservation.status].color}>
                    {statusConfig[reservation.status].label}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCreatedAt(reservation.created_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {reservation.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(reservation.id, "confirmed")}
                          disabled={updating === reservation.id}
                        >
                          {updating === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span className="ml-1 hidden sm:inline">Confirmar</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(reservation.id, "cancelled")}
                          disabled={updating === reservation.id}
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="ml-1 hidden sm:inline">Rechazar</span>
                        </Button>
                      </>
                    )}
                    {reservation.status !== "pending" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white bg-transparent">
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar reserva?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la reserva de {reservation.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteReservation(reservation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  // Mostrar loading mientras verifica autenticación
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Notificacion de nueva reserva */}
      {newReservation && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <Card className="w-80 border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">Nueva Reserva</p>
                  <p className="text-sm text-muted-foreground truncate">{newReservation.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {serviceLabels[newReservation.service_type] || newReservation.service_type}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="shrink-0"
                  onClick={() => setNewReservation(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver al sitio</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <Image
                  src="/images/image.png"
                  alt="Aqua Bear Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
                  <p className="text-sm text-muted-foreground">Gestión de Reservas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchReservations} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmadas</p>
                  <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Canceladas</p>
                  <p className="text-3xl font-bold text-red-600">{cancelledCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reservas</CardTitle>
                <CardDescription>
                  Gestiona las solicitudes de reserva de clases y servicios
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendario
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : viewMode === "calendar" ? (
              <CalendarView />
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">
                    Pendientes ({pendingCount})
                  </TabsTrigger>
                  <TabsTrigger value="confirmed">
                    Confirmadas ({confirmedCount})
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Canceladas ({cancelledCount})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    Todas ({reservations.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                  <ReservationTable data={filterByStatus("pending")} />
                </TabsContent>
                <TabsContent value="confirmed">
                  <ReservationTable data={filterByStatus("confirmed")} />
                </TabsContent>
                <TabsContent value="cancelled">
                  <ReservationTable data={filterByStatus("cancelled")} />
                </TabsContent>
                <TabsContent value="all">
                  <ReservationTable data={filterByStatus("all")} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modal de detalles de reserva */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
            <DialogDescription>
              Informacion completa de la reserva
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={statusConfig[selectedReservation.status].color}>
                  {statusConfig[selectedReservation.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatCreatedAt(selectedReservation.created_at)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">{selectedReservation.name}</p>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Phone className="w-4 h-4 text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{selectedReservation.phone}</p>
                      <p className="text-xs text-muted-foreground">Telefono</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{selectedReservation.email}</p>
                      <p className="text-xs text-muted-foreground">Correo</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">{formatDate(selectedReservation.reservation_date)}</p>
                    <p className="text-sm text-muted-foreground">a las {selectedReservation.reservation_time}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{serviceLabels[selectedReservation.service_type] || selectedReservation.service_type}</p>
                    <p className="text-xs text-muted-foreground">Servicio</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{selectedReservation.participants} persona(s)</p>
                    <p className="text-xs text-muted-foreground">Participantes</p>
                  </div>
                </div>

                {selectedReservation.notes && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm">{selectedReservation.notes}</p>
                      <p className="text-xs text-muted-foreground mt-1">Notas</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {selectedReservation.status === "pending" && (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        updateStatus(selectedReservation.id, "confirmed")
                        setSelectedReservation(null)
                      }}
                      disabled={updating === selectedReservation.id}
                    >
                      {updating === selectedReservation.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Confirmar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        updateStatus(selectedReservation.id, "cancelled")
                        setSelectedReservation(null)
                      }}
                      disabled={updating === selectedReservation.id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                  </>
                )}
                {selectedReservation.status !== "pending" && (
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white bg-transparent"
                    onClick={() => {
                      deleteReservation(selectedReservation.id)
                      setSelectedReservation(null)
                    }}
                    disabled={updating === selectedReservation.id}
                  >
                    Eliminar Reserva
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setSelectedReservation(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
