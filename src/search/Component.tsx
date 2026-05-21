'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocaleContext } from '@/providers/Locale'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const { t } = useLocaleContext()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {t('search.label')}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={t('search.placeholder')}
        />
        <button type="submit" className="sr-only">
          {t('search.submit')}
        </button>
      </form>
    </div>
  )
}
