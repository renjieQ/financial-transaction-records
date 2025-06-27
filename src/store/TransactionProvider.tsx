import { ReactNode, createContext, useContext } from 'react'
import useTransactionStore, { Transaction } from './useTransactionStore'

// Create context to make store available for testing
const TransactionContext = createContext<{
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => string
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => boolean
  deleteTransaction: (id: string) => boolean
} | null>(null)

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactionStore()
  
  return (
    <TransactionContext.Provider value={{ addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionContext = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider')
  }
  return context
}