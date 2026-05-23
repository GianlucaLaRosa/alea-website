'use client'

import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

export type FilterMultiSelectOption = {
  value: string
  label: string
}

type Props = {
  className?: string
  label: string
  options: FilterMultiSelectOption[]
  placeholder: string
  selected: string[]
  selectedSummary: string
  onChange: (values: string[]) => void
}

export function FilterMultiSelect({
  className,
  label,
  options,
  placeholder,
  selected,
  selectedSummary,
  onChange,
}: Props) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    )
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-label={label}
            className={cn('h-9 min-w-[7.5rem] justify-between gap-1 px-3 font-normal', className)}
            type="button"
            variant="outline"
          >
            <span className="truncate">{selected.length > 0 ? selectedSummary : placeholder}</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-60" aria-hidden />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-56 gap-0 rounded-md p-2">
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{label}</p>
        <ul className="max-h-64 overflow-y-auto">
          {options.map((option) => {
            const id = `filter-${label}-${option.value}`
            const checked = selected.includes(option.value)
            return (
              <li key={option.value}>
                <Label
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-normal hover:bg-muted"
                  htmlFor={id}
                >
                  <Checkbox
                    checked={checked}
                    id={id}
                    onCheckedChange={() => toggle(option.value)}
                  />
                  {option.label}
                </Label>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
