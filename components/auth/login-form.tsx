"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Để chuyển hướng
import { useState } from "react";
import { toast } from "react-toastify"; // Import thư viện Toastify

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state cho lỗi
  const [successMessage, setSuccessMessage] = useState(""); // Thêm state cho thành công
  const router = useRouter(); // Khai báo useRouter để chuyển hướng

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://localhost:7129/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem("isLoggedIn", "true"); // Lưu giá trị 'true' khi người dùng đăng nhập
      localStorage.setItem("user", JSON.stringify(data.user)); // Lưu thông tin người dùng vào localStorage
      setSuccessMessage("Đăng nhập thành công!");
      setErrorMessage(""); // Xóa lỗi nếu đăng nhập thành công
      toast.success("Đăng nhập thành công!"); // Hiển thị toast khi đăng nhập thành công
      // Chuyển hướng về trang chủ sau khi đăng nhập
      setTimeout(() => router.push("/"), 2000); // Chuyển hướng sau 2 giây
    } else {
      setErrorMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
      setSuccessMessage(""); // Xóa thông báo thành công nếu có lỗi
      toast.error("Đăng nhập thất bại!"); // Hiển thị toast khi đăng nhập thất bại
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Đăng Nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>

        {errorMessage && (
          <div className="mt-2 text-red-500 bg-red-50 p-2 rounded-md text-sm">
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-2 text-green-500 bg-green-50 p-2 rounded-md text-sm">
            <p>{successMessage}</p>
          </div>
        )}

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            Đăng Nhập
          </Button>
          <div className="text-center text-sm">
            Bạn chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Đăng ký
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
