"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/admin/tours/data-table"
import { columns } from "@/components/admin/tours/columns"

export default function ToursPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý tour</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tour mới
        </Button>
      </div>

      <Card>
        <DataTable columns={columns} data={[]} />
      </Card>
    </div>
  )
}
