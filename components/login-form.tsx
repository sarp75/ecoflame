"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const placeholderMail = "sarp@gmail.com";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === placeholderMail) {
      toast.error("Gerçekten o mail'ı kullanma lütfen.");
      setError(null);
      return;
    }
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/";
      // Update this route to redirect to an authenticated route. The user already has an active session.
      //router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu.");

      const friendlyError =
        (error instanceof Error ? error.message : "Bir hata oluştu.") ===
        "Invalid login credentials"
          ? "Geçersiz giriş bilgileri"
          : error instanceof Error
            ? error.message
            : "Bir hata oluştu.";
      toast.error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Giriş</CardTitle>
          <CardDescription>
            Hesabınıza giriş yapmak için bilgilerini gir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={placeholderMail}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Şifre</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Şifreni mi unuttun?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Hesabın yok mu?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Hesap oluştur
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
