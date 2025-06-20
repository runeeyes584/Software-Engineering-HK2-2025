'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from './columns'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(3, 'Tên danh mục phải có ít nhất 3 ký tự.'),
  description: z.string().optional(),
})

interface CategoryFormProps {
  initialData?: Category | null
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const { getToken } = useAuth()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
    },
  })

  const { isSubmitting } = form.formState
  const isEditMode = !!initialData

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = await getToken()
      const url = isEditMode
        ? `http://localhost:5000/api/categories/${initialData?._id}`
        : `http://localhost:5000/api/categories`
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Đã xảy ra lỗi. Vui lòng thử lại.')
      }

      toast.success(
        `Đã ${isEditMode ? 'cập nhật' : 'tạo'} danh mục thành công!`
      )
      router.push('/admin/categories')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Du lịch biển" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về danh mục..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Đang lưu...'
                : isEditMode
                ? 'Lưu thay đổi'
                : 'Tạo danh mục'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 