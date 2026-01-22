"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Calendar, Clock, Users, CheckCircle2, XCircle, Loader2, RefreshCw, ArrowLeft, LogOut, Bell } from "lucide-react"
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
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
          
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dlYh3aGR3iZeempmMfW5ncoCOmJmYjoF0aGt/jZeXlY2CdmtsfoqVl5aNg3drbnyIk5aUjIN4bW18iJOVk4yDeG5ufIiSlJKLgndubXyIkZOSi4J3b258h5CSkYqBd29ue4eQkZCJgXdvbnuHj5CPiYB3b257ho+Pjoh/d29teoeOjo2Hf3ZubXqGjo6NiH92bm16ho2NjIh/dm5teYaNjYyHfnZubHmGjIyLhn52bWx5hYyLi4Z+dW1seYWLiouFfnVtbHmFi4qKhH51bGx4hIuKiYR9dWxsd4SJiYmDfHRsbHeEiYiIg3x0a2x3hImIiIN8dGtrd4OIh4eCe3Rranb/')
            audio.volume = 0.5
            audio.play().catch(() => {})
          } catch {}
          
          setTimeout(() => setNewReservation(null), 10000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendWhatsAppConfirmation = (reservation: Reservation, isConfirmed: boolean) => {
    const phone = reservation.phone.replace(/\D/g, '')
    const serviceName = serviceLabels[reservation.service_type] || reservation.service_type || "Clase"
    
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <Image
                  src="/images/image.png"
                  alt="Aqua Bear Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">Panel Admin</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Gestión de Reservas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchReservations} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-muted-foreground">Confirmadas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{confirmedCount}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-muted-foreground">Canceladas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">{cancelledCount}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reservas</CardTitle>
            <CardDescription>
              Gestiona las solicitudes de reserva de clases y servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <Tabs defaultValue="pending">
                <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                  <TabsList className="mb-4 w-max sm:w-auto">
                    <TabsTrigger value="pending" className="text-xs sm:text-sm whitespace-nowrap">
                      Pendientes ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="text-xs sm:text-sm whitespace-nowrap">
                      Confirmadas ({confirmedCount})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="text-xs sm:text-sm whitespace-nowrap">
                      Canceladas ({cancelledCount})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="text-xs sm:text-sm whitespace-nowrap">
                      Todas ({reservations.length})
                    </TabsTrigger>
                  </TabsList>
                </div>
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
    </div>
  )
}