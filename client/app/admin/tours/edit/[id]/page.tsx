"use client";

import { useLanguage } from "@/components/language-provider-fixed";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DepartureOption = { departureDate: string; returnDate: string };
interface TourFormState {
  name: string;
  description: string;
  price: string;
  destination: string;
  departureOptions: DepartureOption[];
  maxGuests: string;
  availableSlots: string;
  category: string[];
  status: string;
}

export default function AdminTourEdit() {
  const router = useRouter();
  const params = useParams();
  const { id: tourId } = params;
  const { getToken } = useAuth();
  const { t } = useLanguage()

  const [form, setForm] = useState<TourFormState | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ url: string; type: "image" | "video"; file?: File }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Fetch all categories for the select dropdown
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));

    // Fetch the specific tour data to edit
    const fetchTourData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tours/${tourId}`);
        if (!res.ok) throw new Error("Không tìm thấy tour");
        const data = await res.json();
        setForm({
          name: data.name,
          description: data.description,
          price: String(data.price),
          destination: data.destination,
          departureOptions: data.departureOptions.map((opt: any) => ({
            departureDate: new Date(opt.departureDate).toISOString(),
            returnDate: new Date(opt.returnDate).toISOString()
          })),
          maxGuests: String(data.maxGuests),
          availableSlots: String(data.availableSlots),
          category: data.category.map((c: any) => c._id),
          status: data.status,
        });
        const imagePreviews = data.images.map((url: string) => ({ url, type: "image" as const }));
        const videoPreviews = data.videos.map((url: string) => ({ url, type: "video" as const }));
        setPreviews([...imagePreviews, ...videoPreviews]);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    if (tourId) {
      fetchTourData();
    }
  }, [tourId]);


  if (pageLoading || !form) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string | boolean) => {
    if (!form) return;
    setForm({ ...form, [name]: value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image" as "image" | "video",
        file: file,
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemovePreview = (indexToRemove: number) => {
    const previewToRemove = previews[indexToRemove];
    if (previewToRemove.file) { // Only revoke if it's a new file from createObjectURL
        URL.revokeObjectURL(previewToRemove.url);
    }
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleDepartureOptionChange = (idx: number, field: keyof DepartureOption, value: string) => {
    if (!form) return;
    const updated = [...form.departureOptions];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, departureOptions: updated });
  };

  const addDepartureOption = () => {
    if (!form) return;
    setForm({ ...form, departureOptions: [...form.departureOptions, { departureDate: "", returnDate: "" }] });
  };

  const removeDepartureOption = (idx: number) => {
    if (!form) return;
    setForm({ ...form, departureOptions: form.departureOptions.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;

    setLoading(true);
    setUploading(true);
    const token = await getToken();

    try {
      const newFiles = previews.filter(p => p.file).map(p => p.file as File);
      const existingImageUrls = previews.filter(p => !p.file && p.type === 'image').map(p => p.url);
      const existingVideoUrls = previews.filter(p => !p.file && p.type === 'video').map(p => p.url);

      let uploadedImageUrls: string[] = [];
      let uploadedVideoUrls: string[] = [];

      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(file => formData.append("files", file));

        const cloudinaryRes = await fetch("http://localhost:5000/api/cloudinary/upload-multiple", {
            method: "POST",
            body: formData,
        });

        if (!cloudinaryRes.ok) throw new Error("Tải file mới lên thất bại.");
        
        const cloudinaryData = await cloudinaryRes.json();
        uploadedImageUrls = cloudinaryData.files.filter((f: any) => f.type === 'image').map((f: any) => f.fileUrl);
        uploadedVideoUrls = cloudinaryData.files.filter((f: any) => f.type === 'video').map((f: any) => f.fileUrl);
      }
      
      setUploading(false);

      const tourPayload = {
        ...form,
        images: [...existingImageUrls, ...uploadedImageUrls],
        videos: [...existingVideoUrls, ...uploadedVideoUrls],
        price: Number(form.price),
        maxGuests: Number(form.maxGuests),
        availableSlots: Number(form.availableSlots),
        duration: form.departureOptions.reduce((max, opt) => {
            if (opt.departureDate && opt.returnDate) {
                const departure = parseISO(opt.departureDate);
                const ret = parseISO(opt.returnDate);
                const diff = (ret.getTime() - departure.getTime()) / (1000 * 3600 * 24) + 1;
                return Math.max(max, diff);
            }
            return max;
        }, 0)
      };

      const tourRes = await fetch(`http://localhost:5000/api/tours/${tourId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(tourPayload),
      });

      if (!tourRes.ok) {
        const errorData = await tourRes.json();
        throw new Error(errorData.message || "Cập nhật tour thất bại.");
      }

      toast.success("Cập nhật tour thành công!");
      router.push("/admin/tours");

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Chỉnh sửa tour</h1>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => router.push('/admin/tours')}>Hủy</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (uploading ? "Đang tải lên..." : "Đang lưu...") : "Lưu thay đổi"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="name" className="block font-semibold mb-1">Tên tour *</label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="VD: Tour khám phá Đà Nẵng 3N2Đ" required />
                </div>
                <div>
                  <label htmlFor="description" className="block font-semibold mb-1">Mô tả *</label>
                  <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Mô tả chi tiết về tour..." rows={6} required />
                </div>
                <div>
                  <label htmlFor="destination" className="block font-semibold mb-1">Điểm đến *</label>
                  <Input id="destination" name="destination" value={form.destination} onChange={handleChange} placeholder="VD: Đà Nẵng, Việt Nam" required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ảnh và Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Tải file lên</span>
                    <input id="file-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*,video/*" />
                  </label>
                  <p className="text-xs text-gray-500">Kéo và thả hoặc nhấp để tải lên</p>
                </div>
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previews.map((p, index) => (
                      <div key={p.url} className="relative group">
                        {p.type === 'image' ? (
                          <img src={p.url} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-lg" />
                        ) : (
                          <video src={p.url} className="w-full h-32 object-cover rounded-lg" controls />
                        )}
                        <div className="absolute top-0 right-0 p-1">
                          <Button variant="destructive" size="icon" className="h-6 w-6 opacity-75 group-hover:opacity-100" onClick={() => handleRemovePreview(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Giá & Số lượng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="price" className="block font-semibold mb-1">Giá (USD) *</label>
                  <Input id="price" name="price" type="number" min={0} value={form.price} onChange={handleChange} placeholder="0.00" required />
                </div>
                <div>
                  <label htmlFor="maxGuests" className="block font-semibold mb-1">Số khách tối đa *</label>
                  <Input id="maxGuests" name="maxGuests" type="number" min={1} value={form.maxGuests} onChange={handleChange} placeholder="0" required />
                </div>
                <div>
                  <label htmlFor="availableSlots" className="block font-semibold mb-1">Số chỗ còn lại *</label>
                  <Input id="availableSlots" name="availableSlots" type="number" min={0} value={form.availableSlots} onChange={handleChange} placeholder="0" required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân loại & Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Danh mục *</label>
                  <MultiSelect
                    options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                    selected={form.category}
                    onChange={(newCategories) => setForm({ ...form!, category: newCategories })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block font-semibold mb-1">Trạng thái *</label>
                  <Select name="status" value={form.status} onValueChange={(value) => handleSelect('status', value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lịch trình khởi hành *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.departureOptions.map((opt, idx) => (
                  <div key={idx} className="space-y-2 p-2 border rounded-md relative">
                     {form.departureOptions.length > 1 && (
                      <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => removeDepartureOption(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-sm font-medium">{t('booking.departure')}</label>
                        <Popover open={openPopovers[`departure-${idx}`] || false} onOpenChange={(isOpen) => setOpenPopovers(prev => ({ ...prev, [`departure-${idx}`]: isOpen }))}>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !opt.departureDate && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {opt.departureDate ? format(parseISO(opt.departureDate), "dd/MM/yyyy") : <span>Chọn ngày đi</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={opt.departureDate ? parseISO(opt.departureDate) : undefined}
                              onSelect={(date) => {
                                handleDepartureOptionChange(idx, "departureDate", date ? date.toISOString() : "");
                                setOpenPopovers(prev => ({ ...prev, [`departure-${idx}`]: false }));
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-sm font-medium">{t('booking.return')}</label>
                        <Popover open={openPopovers[`return-${idx}`] || false} onOpenChange={(isOpen) => setOpenPopovers(prev => ({ ...prev, [`return-${idx}`]: isOpen }))}>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !opt.returnDate && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {opt.returnDate ? format(parseISO(opt.returnDate), "dd/MM/yyyy") : <span>Chọn ngày về</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={opt.returnDate ? parseISO(opt.returnDate) : undefined}
                              onSelect={(date) => {
                                handleDepartureOptionChange(idx, "returnDate", date ? date.toISOString() : "");
                                setOpenPopovers(prev => ({ ...prev, [`return-${idx}`]: false }));
                              }}
                              disabled={(date) => opt.departureDate ? date < parseISO(opt.departureDate) : false}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={addDepartureOption}>Thêm lịch trình</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 