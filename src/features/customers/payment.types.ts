interface Payment {
  id: string
  customerID: string
  amount: number
  date: string
  observation?: string | null
  createdAt?: string
}

export type { Payment }
