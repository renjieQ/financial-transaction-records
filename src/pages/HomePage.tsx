import { useState, useEffect } from 'react'
import { 
  CircleDollarSign, 
  RefreshCcw,
  Plus,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionStats } from '@/components/transactions/TransactionStats'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'
import useTransactionStore, { Transaction, TransactionType, TransactionStatus } from '@/store/useTransactionStore'

// Sample transactions for testing
const sampleTransactions = [
  {
    amount: 1250.00,
    description: "Salary deposit",
    type: "deposit" as TransactionType,
    status: "completed" as TransactionStatus
  },
  {
    amount: 89.99,
    description: "Grocery shopping",
    type: "withdrawal" as TransactionType,
    status: "completed" as TransactionStatus
  },
  {
    amount: 500.00,
    description: "Transfer to savings",
    type: "transfer" as TransactionType,
    status: "completed" as TransactionStatus,
    sender: "Checking account (1234)",
    recipient: "Savings account (5678)"
  },
  {
    amount: 199.50,
    description: "Monthly subscription",
    type: "withdrawal" as TransactionType,
    status: "pending" as TransactionStatus
  },
  {
    amount: 50.00,
    description: "Friend payment",
    type: "transfer" as TransactionType,
    status: "completed" as TransactionStatus,
    sender: "Checking account (1234)",
    recipient: "John Smith (9876)"
  }
]

// Default filter options
const defaultFilters = {
  type: 'all' as 'all' | TransactionType,
  status: 'all' as 'all' | TransactionStatus,
  search: '',
  sortBy: 'date' as 'date' | 'amount' | 'description',
  sortDirection: 'desc' as 'asc' | 'desc'
}

function HomePage() {
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState(defaultFilters)

  const { 
    transactions, 
    isLoading: storeLoading, 
    error,
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    clearAll
  } = useTransactionStore()

  // Initialize with sample data
  useEffect(() => {
    const initSampleData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API loading
      
      // Only add sample data if none exist
      if (transactions.length === 0) {
        sampleTransactions.forEach(transaction => {
          addTransaction(transaction)
        })
      }
      
      setIsLoading(false)
    }
    
    initSampleData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const id = addTransaction(transactionData)
    
    if (id) {
      setIsAddSheetOpen(false)
      toast({
        title: "Transaction created",
        description: "New transaction has been successfully added",
      })
    } else if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    }
  }

  const handleUpdateTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    if (!transactionToEdit) return
    
    const success = updateTransaction(transactionToEdit.id, transactionData)
    
    if (success) {
      setTransactionToEdit(null)
      setIsEditSheetOpen(false)
      toast({
        title: "Transaction updated",
        description: "Your changes have been saved successfully",
      })
    } else if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction)
    setIsEditSheetOpen(true)
  }

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id)
  }

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  // Apply filters and sorting to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Type filter
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false
    }
    
    // Status filter
    if (filters.status !== 'all' && transaction.status !== filters.status) {
      return false
    }
    
    // Search filter (case-insensitive)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesDescription = transaction.description.toLowerCase().includes(searchLower)
      const matchesSender = transaction.sender?.toLowerCase().includes(searchLower)
      const matchesRecipient = transaction.recipient?.toLowerCase().includes(searchLower)
      
      if (!matchesDescription && !matchesSender && !matchesRecipient) {
        return false
      }
    }
    
    return true
  }).sort((a, b) => {
    // Apply sorting
    const { sortBy, sortDirection } = filters
    const multiplier = sortDirection === 'asc' ? 1 : -1
    
    switch (sortBy) {
      case 'date':
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime())
      case 'amount':
        return multiplier * (a.amount - b.amount)
      case 'description':
        return multiplier * a.description.localeCompare(b.description)
      default:
        return 0
    }
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-xl">Loading banking system...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <CircleDollarSign className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">Banking Transaction System</h1>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Create Transaction</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <TransactionForm 
                  onSubmit={handleCreateTransaction}
                  isSubmitting={storeLoading}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <Button 
            variant="outline"
            onClick={() => {
              clearAll()
              sampleTransactions.forEach(transaction => {
                addTransaction(transaction)
              })
              toast({
                title: "Data reset",
                description: "Transaction data has been reset to default",
              })
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Data
          </Button>
        </div>
      </div>
      
      <TransactionStats transactions={transactions} />
      
      <div className="mt-8">
        {/* Filters */}
        <TransactionFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onReset={resetFilters}
        />
        
        {/* Transaction list */}
        <TransactionList 
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
        
        {/* Edit transaction sheet */}
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Edit Transaction</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              {transactionToEdit && (
                <TransactionForm 
                  transaction={transactionToEdit}
                  onSubmit={handleUpdateTransaction}
                  isSubmitting={storeLoading}
                  title="Edit Transaction"
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default HomePage