'use client'

import { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getCategoryColumns, Category } from '@/components/admin/categories/columns'
import { DataTable } from '@/components/admin/categories/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/categories')
        const data = await response.json()
        setCategories(data || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Hàm xóa danh mục khỏi state
  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat._id !== id))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Link href="/admin/categories/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Quản lý các danh mục tour trong hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <DataTable columns={getCategoryColumns(handleDeleteCategory)} data={categories} />
          )}
        </CardContent>
      </Card>
    </>
  )
} 