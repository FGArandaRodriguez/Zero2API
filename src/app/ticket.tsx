'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { Loader2, CreditCard, DollarSign, Utensils } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

interface Ticket {
  id_ticket: number
  id_pedido: number
  id_metodo_pago: number
  total: number
  pedido: Pedido
  metodo_pago: MetodoPago
}

interface Pedido {
  id:number
  fecha: string
  Pago: Pago[]
  DetallePedido: DetallePedido[]
}

interface Pago {
  total: number
  fecha_pago: string
}

interface DetallePedido {
  cantidad: number
  subtotal: number
  Menu: Menu
}

interface Menu {
  nombre: string
  precio: number
}

interface MetodoPago {
  nombre: string
}



export default function Ticket() {
  const [order, setOrder] = useState<Ticket | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/tickets?id_ticket=2')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOrder(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);
  /*const reqTicket: any[] = [
    useEffect(() => {
      fetch('http://localhost:3000/api/ticket?id=2')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTicket(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, [])
  ];
  const [order, setTicket] = useState<Ticket>(reqTicket);

  const [TicketDetails, setTicket] = useState<TicketDetails>({
    method: 'card',
    cardNumber: '',
    cardHolder: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    tipPercentage: 15,
  })*/
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!order) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-[#FAB677] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="w-full h-screen bg-cover bg-center">
            <img src="/assets/taste.png" alt="Taste" className="w-full h-auto bg-red-600" />
          </div>

        </CardHeader>
        <CardContent>
          <div className="space-y-">
            <div>
              <div className="flex justify-between">
                <span className='text-sm mb-8'>Ubicacion: Carretera Cancun-Aeropuerto, S.M 299-km. 11.5, 77565 Q.R</span>
              </div>
              <p className='text-center my-5' >-----------------------------------------------------------------------------------</p>

              <div className="flex justify-between mb-1	">
                <span className='text-sm font-semibold '>Fecha y Hora:</span>
                <span className='text-sm'>{order.pedido.fecha}</span>
              </div>

              <div className="flex justify-between mb-1	">
                <span className='text-sm font-semibold '>Numero de Pedido:</span>
                <span className='text-sm'>#{order.pedido.id}</span>
              </div>

              <div className="flex justify-between">
                <span className='text-sm font-semibold '>Metodo de Pago:</span>
                <span className='text-sm'>{order.metodo_pago.nombre}</span>
              </div>
              <p className='text-center my-5' >-----------------------------------------------------------------------------------</p>
              <h3 className="text-2xl font-bold">Productos</h3>
              <div className="text-lg font-semibold items-center py-2 ">
                <span>Cantidad: </span>
                <span>5 </span>
              </div>

              {order.pedido.DetallePedido.map((detalle, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span>
                    {detalle.Menu.nombre} x {detalle.cantidad}
                  </span>
                  <span>${(detalle.Menu.precio * detalle.cantidad).toFixed(2)}</span>
                </div>
              ))}

              <div className="flex justify-between items-center py-2 font-semibold border-b">
                <span>Subtotal</span>
                <span>
                  ${order.pedido.DetallePedido.map((detalle, index) => (detalle.subtotal))}
                </span>
              </div>

              {/* TODO: adquerir la cantidad de la propina en el back */}
              <div className="flex justify-between items-center py-2 border-b">
                <span>Propina</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Cargo adicional</span>
              <span>$0.00</span>
            </div>
            <p className='text-center my-5' >-----------------------------------------------------------------------------------</p>
            {/* TODO: adquerir la cantidad total desde el back */}
            <div className="flex justify-between items-center py-2 text-lg font-bold">
              <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}