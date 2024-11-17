'use client'

import { useState } from 'react'
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

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface PaymentDetails {
  method: 'card' | 'cash'
  cardNumber?: string
  cardHolder?: string
  expirationMonth?: string
  expirationYear?: string
  cvv?: string
  tipPercentage: number
}

const SAMPLE_ORDER: OrderItem[] = [
  { id: '1', name: 'Hamburguesa', price: 10.99, quantity: 2 },
  { id: '2', name: 'Papas fritas', price: 3.99, quantity: 1 },
  { id: '3', name: 'Refresco', price: 2.49, quantity: 2 },
]

export default function Ticket() {
  const [order] = useState<OrderItem[]>(SAMPLE_ORDER)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'card',
    cardNumber: '',
    cardHolder: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    tipPercentage: 15,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [name]: value }))
  }

  const calculateSubtotal = () => {
    return order.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateTip = () => {
    return calculateSubtotal() * (paymentDetails.tipPercentage / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTip()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (paymentDetails.method === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardHolder || 
          !paymentDetails.expirationMonth || !paymentDetails.expirationYear || !paymentDetails.cvv) {
        setError('Por favor, complete todos los campos de la tarjeta')
        setLoading(false)
        return
      }
    }

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(true)
      setPaymentDetails({
        ...paymentDetails,
        cardNumber: '',
        cardHolder: '',
        expirationMonth: '',
        expirationYear: '',
        cvv: '',
      })
    } catch (err) {
      setError('El procesamiento del pago falló. Por favor, intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAB677] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#EC8439]">Ticket</CardTitle>
          <CardDescription>Detalles del pedido</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Resumen del Pedido</h3>
                {order.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-semibold border-b">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                {/* TODO: adquerir la cantidad de la propina en el back */}
                <div className="flex justify-between items-center py-2">
                  <span>Propina</span>
                  <span>$0.00</span>
                </div>
              </div>
                {/* TODO: adquerir la cantidad total desde el back */}
              <div className="flex justify-between items-center py-2 text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              {/* TODO: adquerir el metodo de pago desde el back */}
              <div>
                <Label className="text-lg font-semibold">Método de Pago</Label>
                <Select
                  value={paymentDetails.method}
                  onValueChange={(value: 'card' | 'cash') => handleSelectChange('method', value)}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Seleccione método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Tarjeta de Crédito/Débito</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentDetails.method === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Nombre del Titular</Label>
                    <Input
                      id="cardHolder"
                      name="cardHolder"
                      value={paymentDetails.cardHolder}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Fecha de Expiración</Label>
                      <div className="flex gap-2">
                        <Select
                          value={paymentDetails.expirationMonth}
                          onValueChange={(value) => handleSelectChange('expirationMonth', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Mes" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={paymentDetails.expirationYear}
                          onValueChange={(value) => handleSelectChange('expirationYear', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Año" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mt-4">
                <AlertDescription>¡Pago procesado con éxito!</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full mt-6 bg-[#EC8439] hover:bg-[#EE9D5E]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {paymentDetails.method === 'card' ? (
                    <CreditCard className="mr-2 h-4 w-4" />
                  ) : (
                    <DollarSign className="mr-2 h-4 w-4" />
                  )}
                  Pagar Ahora
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 text-center w-full">
            Su información de pago está segura y encriptada
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}