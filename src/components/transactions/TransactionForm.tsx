import { useState, useEffect, FormEvent } from 'react'
import { Plus, Pencil, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Transaction, TransactionType, TransactionStatus } from '@/store/useTransactionStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TransactionFormProps {
  onSubmit: (transactionData: Omit<Transaction, 'id' | 'date'>) => void
  transaction?: Transaction
  isSubmitting?: boolean
  title?: string
}

const initialState: Omit<Transaction, 'id' | 'date'> = {
  amount: 0,
  description: '',
  type: 'deposit',
  status: 'completed',
  recipient: '',
  sender: ''
}

export function TransactionForm({ 
  onSubmit, 
  transaction, 
  isSubmitting = false,
  title = 'Add New Transaction'
}: TransactionFormProps) {
  const [formData, setFormData] = useState<Omit<Transaction, 'id' | 'date'>>(
    transaction ? {
      amount: transaction.amount,
      description: transaction.description,
      type: transaction.type,
      status: transaction.status,
      recipient: transaction.recipient || '',
      sender: transaction.sender || ''
    } : initialState
  )

  // Update form if transaction changes (for editing)
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        description: transaction.description,
        type: transaction.type,
        status: transaction.status,
        recipient: transaction.recipient || '',
        sender: transaction.sender || ''
      })
    }
  }, [transaction])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof typeof initialState, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {transaction ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Transaction description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup 
              value={formData.type} 
              onValueChange={(value) => handleInputChange('type', value as TransactionType)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deposit" id="deposit" />
                <Label htmlFor="deposit">Deposit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="withdrawal" id="withdrawal" />
                <Label htmlFor="withdrawal">Withdrawal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer">Transfer</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.type === 'transfer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sender">Sender Account</Label>
                <Input
                  id="sender"
                  value={formData.sender}
                  onChange={(e) => handleInputChange('sender', e.target.value)}
                  placeholder="Sender account number"
                  required={formData.type === 'transfer'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Account</Label>
                <Input
                  id="recipient"
                  value={formData.recipient}
                  onChange={(e) => handleInputChange('recipient', e.target.value)}
                  placeholder="Recipient account number"
                  required={formData.type === 'transfer'}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value as TransactionStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isSubmitting}
          >
            <Check className="mr-2 h-4 w-4" />
            {transaction ? 'Update Transaction' : 'Create Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}