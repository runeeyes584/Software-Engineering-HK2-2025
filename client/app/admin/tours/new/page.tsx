"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

const categories = ["Cruise", "Adventure", "Cultural", "Beach", "City", "Wildlife"];
const statuses = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "draft", label: "Bản nháp" },
];

export default function AdminTourNew() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    status: "active",
    image: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Chọn file:', file);
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    try {
      const res = await fetch("http://localhost:5000/api/cloudinary/upload-multiple", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload ảnh thất bại.");
      const data = await res.json();
      setForm({ ...form, image: data.files[0].fileUrl });
      console.log('Upload thành công:', data.files[0].fileUrl);
    } catch (err) {
      setError((err as Error).message);
      console.error('Lỗi upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.category || !form.price || !form.duration || !form.status || !form.image) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc, bao gồm cả ảnh đại diện.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price),
          duration: form.duration,
          status: form.status,
          image: form.image,
          description: form.description,
        }),
      });
      if (!res.ok) throw new Error("Không thể thêm tour mới.");
      router.push("/admin/tours");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="shadow-2xl border-0 rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-2xl">
          <CardTitle className="text-2xl font-bold text-green-700">Thêm tour mới</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Tên tour *</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Nhập tên tour" required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Loại tour *</label>
              <Select value={form.category} onValueChange={(v) => handleSelect("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tour" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Giá (USD) *</label>
                <Input name="price" type="number" min={0} value={form.price} onChange={handleChange} placeholder="Nhập giá" required />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Thời lượng *</label>
                <Input name="duration" value={form.duration} onChange={handleChange} placeholder="VD: 3 days, 2N1Đ..." required />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Trạng thái *</label>
              <Select value={form.status} onValueChange={(v) => handleSelect("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Thêm ảnh *</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? "Đang tải lên..." : "Chọn ảnh"}
                  </Button>
                </label>
                {form.image && (
                  <img src={form.image} alt="Ảnh" className="h-14 w-14 object-cover rounded-lg border" />
                )}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Mô tả</label>
              <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả tour..." rows={4} />
            </div>
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={loading}>
              {loading ? "Đang lưu..." : "Thêm tour mới"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 