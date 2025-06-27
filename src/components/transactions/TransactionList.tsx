import { useState } from 'react'
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowLeftRight,
  Calendar, 
  Trash2, 
  Edit2,
  Check,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast'
import { Transaction } from '@/store/useTransactionStore'
import { useIsMobile } from '@/hooks/use-mobile'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transactionId: string) => void
}

export function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete 
}: TransactionListProps) {
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleDelete = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete)
      setTransactionToDelete(null)
      toast({
        title: "Transaction deleted",
        description: "The transaction has been permanently removed",
      })
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />
      case 'withdrawal':
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" /> Completed
        </Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Failed
        </Badge>
    }
  }

  // Format amount with currency symbol
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount)
  }

  if (transactions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No transactions found. Create your first transaction to get started.
        </CardContent>
      </Card>
    )
  }

  // Mobile view shows transactions as cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {transactions.map(transaction => (
          <Card key={transaction.id} className="w-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(transaction.type)}
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(transaction.date), 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>
                </div>
                <div className="font-medium">
                  {formatAmount(transaction.amount)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  {getStatusBadge(transaction.status)}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setTransactionToDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {transaction.type === 'transfer' && (
                <div className="mt-2 text-sm">
                  <div>From: {transaction.sender}</div>
                  <div>To: {transaction.recipient}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Delete confirmation dialog */}
        <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this transaction.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  // Desktop view shows transactions in a table
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{getTypeIcon(transaction.type)}</TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>{formatAmount(transaction.amount)}</TableCell>
                <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>
                  {transaction.type === 'transfer' && (
                    <div className="text-xs text-muted-foreground">
                      <div>From: {transaction.sender}</div>
                      <div>To: {transaction.recipient}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setTransactionToDelete(transaction.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Delete confirmation dialog */}
        <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this transaction.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}