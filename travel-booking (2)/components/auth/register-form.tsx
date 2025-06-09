"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify"; // Import toastify

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);  // Thêm state để kiểm tra form đã gửi

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra xem mật khẩu có khớp không
    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7129/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
        }),
      });

      if (response.ok) {
        toast.success("Đăng ký thành công!"); // Hiển thị thông báo thành công
        // Reset dữ liệu trong form khi đăng ký thành công
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSubmitted(true);  // Đánh dấu form đã được gửi thành công
      } else {
        const errorData = await response.json();
        toast.error(`Đăng ký thất bại! ${errorData.message || "Vui lòng thử lại."}`);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Đăng Ký</CardTitle>
        <CardDescription>Tạo tài khoản để bắt đầu đặt tour</CardDescription>
      </CardHeader>
      
      {isSubmitted ? (
        // Nếu đăng ký thành công, hiển thị thông báo
        <CardContent className="text-center">
          <h2 className="text-lg font-semibold">Đăng ký thành công!</h2>
          <p className="mt-4">Vui lòng đăng nhập để tiếp tục.</p>
          <Link href="/auth/login" className="text-primary hover:underline mt-4">Đi đến đăng nhập</Link>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Tên</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Họ</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Đăng Ký</Button>
            <div className="text-center text-sm">
              Bạn đã có tài khoản?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">Đăng nhập</Link>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
