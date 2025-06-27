import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, BarChart2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/store/useTransactionStore'

interface TransactionStatsProps {
  transactions: Transaction[]
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  // Calculate transaction statistics
  const totalTransactions = transactions.length
  
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalTransfers = transactions
    .filter(t => t.type === 'transfer' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const balance = totalDeposits - totalWithdrawals

  // Format amounts
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatAmount(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalTransactions} total transactions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-green-500" />
            Total Deposits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatAmount(totalDeposits)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {transactions.filter(t => t.type === 'deposit').length} deposits
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-red-500" />
            Total Withdrawals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatAmount(totalWithdrawals)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {transactions.filter(t => t.type === 'withdrawal').length} withdrawals
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-blue-500" />
            Total Transfers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatAmount(totalTransfers)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {transactions.filter(t => t.type === 'transfer').length} transfers
          </p>
        </CardContent>
      </Card>
    </div>
  )
}