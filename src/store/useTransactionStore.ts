import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  amount: number
  description: string
  type: TransactionType
  date: Date
  status: TransactionStatus
  recipient?: string
  sender?: string
}

interface TransactionStore {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => string
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => boolean
  deleteTransaction: (id: string) => boolean
  getTransaction: (id: string) => Transaction | undefined
  
  // For testing and simulation
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAll: () => void
}

const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  
  addTransaction: (transactionData) => {
    // Validate required fields
    if (transactionData.amount <= 0) {
      set({ error: 'Transaction amount must be greater than zero' })
      return ''
    }
    
    if (!transactionData.description) {
      set({ error: 'Transaction description is required' })
      return ''
    }
    
    // For transfers, validate sender and recipient
    if (transactionData.type === 'transfer') {
      if (!transactionData.sender || !transactionData.recipient) {
        set({ error: 'Transfer transactions require both sender and recipient' })
        return ''
      }
    }
    
    const id = uuidv4()
    const newTransaction = {
      ...transactionData,
      id,
      date: new Date()
    }
    
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
      error: null
    }))
    
    return id
  },
  
  updateTransaction: (id, updatedFields) => {
    const transaction = get().getTransaction(id)
    
    if (!transaction) {
      set({ error: `Transaction with ID ${id} not found` })
      return false
    }
    
    // If amount is being updated, validate it
    if (updatedFields.amount && updatedFields.amount <= 0) {
      set({ error: 'Transaction amount must be greater than zero' })
      return false
    }
    
    set((state) => ({
      transactions: state.transactions.map((t) => 
        t.id === id ? { ...t, ...updatedFields } : t
      ),
      error: null
    }))
    
    return true
  },
  
  deleteTransaction: (id) => {
    const transaction = get().getTransaction(id)
    
    if (!transaction) {
      set({ error: `Transaction with ID ${id} not found` })
      return false
    }
    
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
      error: null
    }))
    
    return true
  },
  
  getTransaction: (id) => {
    return get().transactions.find((t) => t.id === id)
  },
  
  // Helper functions for simulation
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearAll: () => set({ transactions: [], error: null })
}))

export default useTransactionStore