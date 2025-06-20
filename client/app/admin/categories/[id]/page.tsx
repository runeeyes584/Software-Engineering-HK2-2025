'use client'

import { CategoryForm } from '@/components/admin/categories/category-form'
import { Category } from '@/components/admin/categories/columns'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { use as usePromise } from 'react'

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:5000/api/categories/${id}`
        )
        const data = await response.json()
        setCategory(data)
      } catch (error) {
        console.error('Failed to fetch category:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCategory()
    }
  }, [id])

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    )
  }

  return <CategoryForm initialData={category} />
} 