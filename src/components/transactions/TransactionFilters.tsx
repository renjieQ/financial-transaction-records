import { SlidersHorizontal, Filter } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { TransactionType, TransactionStatus } from '@/store/useTransactionStore'

interface FilterOptions {
  type?: TransactionType | 'all'
  status?: TransactionStatus | 'all'
  search: string
  sortBy: 'date' | 'amount' | 'description'
  sortDirection: 'asc' | 'desc'
}

interface TransactionFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
  onReset: () => void
}

export function TransactionFilters({ 
  filters, 
  onFilterChange,
  onReset
}: TransactionFiltersProps) {
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search' && value) return true
    if ((key === 'type' || key === 'status') && value !== 'all') return true
    return false
  }).length

  return (
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-1 gap-2">
            <Input 
              placeholder="Search transactions..." 
              value={filters.search} 
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Select 
                value={filters.type} 
                onValueChange={(value) => onFilterChange({ type: value as TransactionType | 'all' })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Transaction Type</SelectLabel>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select 
                value={filters.status} 
                onValueChange={(value) => onFilterChange({ status: value as TransactionStatus | 'all' })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Transaction Status</SelectLabel>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Select 
              value={`${filters.sortBy}-${filters.sortDirection}`}
              onValueChange={(value) => {
                const [sortBy, sortDirection] = value.split('-') as [
                  'date' | 'amount' | 'description',
                  'asc' | 'desc'
                ]
                onFilterChange({ sortBy, sortDirection })
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort Options</SelectLabel>
                  <SelectItem value="date-desc">Newest first</SelectItem>
                  <SelectItem value="date-asc">Oldest first</SelectItem>
                  <SelectItem value="amount-desc">Highest amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest amount</SelectItem>
                  <SelectItem value="description-asc">A to Z</SelectItem>
                  <SelectItem value="description-desc">Z to A</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onReset}
                className="text-muted-foreground"
              >
                Clear filters
                <Badge variant="secondary" className="ml-2 font-normal">
                  {activeFilterCount}
                </Badge>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}