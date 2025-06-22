"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, Eye, ImageIcon, Info, MapPin, Route, Star, UserCheck, UserX } from "lucide-react";
import Image from "next/image";
import { Tour } from "./columns"; // Import Tour type

interface TourDetailModalProps {
    tour: Tour | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TourDetailModal({ tour, isOpen, onClose }: TourDetailModalProps) {
    if (!tour) return null;

    const allMedia = [
        ...(tour.images?.map(url => ({ type: 'image', url })) || []),
        // Kích hoạt lại logic video
        ...(tour.videos?.map(url => ({ type: 'video', url })) || []) 
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{tour.name}</DialogTitle>
                    <DialogDescription>
                        <MapPin className="inline-block h-4 w-4 mr-1" />
                        {/* Assuming destination exists on the tour object */}
                        {/* {tour.destination}  */}
                         ID: {tour.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4 -mr-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left side: Media */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center"><ImageIcon className="h-5 w-5 mr-2" />Ảnh & Video</h3>
                        {allMedia.length > 0 ? (
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {allMedia.map((media, index) => (
                                        <CarouselItem key={index}>
                                            {media.type === 'image' ? (
                                                <Image src={media.url} alt={`${tour.name} - ảnh ${index + 1}`} width={800} height={600} className="w-full h-auto object-cover rounded-lg" />
                                            ) : (
                                                <div className="aspect-video">
                                                    <iframe src={media.url} title={`${tour.name} - video ${index + 1}`} className="w-full h-full rounded-lg" allowFullScreen />
                                                </div>
                                            )}
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                            </Carousel>
                        ) : (
                            <div className="text-center text-muted-foreground py-10">Không có ảnh hoặc video.</div>
                        )}
                    </div>

                    {/* Right side: Details */}
                    <div className="space-y-4">
                         <h3 className="font-semibold flex items-center"><Info className="h-5 w-5 mr-2" />Thông tin chi tiết</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> <strong>Giá:</strong> ${tour.price.toLocaleString()}</div>
                            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> <strong>Thời lượng:</strong> {tour.duration} ngày</div>
                            <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> <strong>Đánh giá:</strong> {tour.rating || 'N/A'}</div>
                            <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /> <strong>Lượt đặt:</strong> {tour.bookings || 0}</div>
                            <div className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-primary" /> <strong>Tối đa:</strong> {tour.maxGuests || 'N/A'} khách</div>
                            <div className="flex items-center gap-2"><UserX className="h-4 w-4 text-primary" /> <strong>Còn lại:</strong> {tour.availableSlots ?? 'N/A'} slot</div>
                             <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" /> 
                                    <strong>Trạng thái:</strong> 
                                    <Badge variant={tour.status === 'active' ? 'default' : 'destructive'}>{tour.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Badge>
                                </div>
                             </div>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center"><Route className="h-5 w-5 mr-2"/> Tùy chọn ngày đi</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto text-sm">
                                {tour.departureOptions && tour.departureOptions.length > 0 ? (
                                    tour.departureOptions.map((opt, index) => (
                                        <div key={index} className="p-2 border rounded-md bg-muted/50">
                                            <p><strong>Khởi hành:</strong> {format(new Date(opt.departureDate), 'dd/MM/yyyy')}</p>
                                            <p><strong>Trở về:</strong> {format(new Date(opt.returnDate), 'dd/MM/yyyy')}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">Chưa có thông tin ngày đi.</p>
                                )}
                            </div>
                        </div>

                         <Separator />
                        <div>
                            <h4 className="font-semibold mb-2">Danh mục</h4>
                            <div className="flex flex-wrap gap-2">
                                {tour.category?.map(cat => <Badge key={cat._id} variant="secondary">{cat.name}</Badge>)}
                            </div>
                        </div>
                        
                        {tour.description && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold mb-2">Mô tả</h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{tour.description}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 