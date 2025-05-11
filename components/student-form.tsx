"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addStudent, checkUsernameAvailability } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  nama_lengkap: z.string().min(2, {
    message: "Nama lengkap harus minimal 2 karakter.",
  }),
  username: z.string().min(3, {
    message: "Username harus minimal 3 karakter.",
  }),
  password: z.string().min(6, {
    message: "Password harus minimal 6 karakter.",
  }),
  kelas: z.string().min(1, {
    message: "Kelas tidak boleh kosong.",
  }),
});

export function StudentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_lengkap: "",
      username: "",
      password: "",
      kelas: "",
    },
  });

  // Watch username field
  const username = form.watch("username");

  useEffect(() => {
    const check = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const result = await checkUsernameAvailability(username);
        setUsernameAvailable(result.available ?? false);

        // set error if not available
        if (!result.available) {
          form.setError("username", {
            type: "manual",
            message: "Username sudah digunakan",
          });
        } else {
          form.clearErrors("username");
        }
      } catch (err) {
        console.error("Cek username gagal", err);
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const delay = setTimeout(check, 500);
    return () => clearTimeout(delay);
  }, [username]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("nama_lengkap", values.nama_lengkap);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("kelas", values.kelas);

    const result = await addStudent(formData);

    setIsSubmitting(false);

    if (result.error) {
      if (result.error.toLowerCase().includes("username")) {
        form.setError("username", {
          type: "manual",
          message: result.error,
        });
      }

      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: result.error,
      });
      return;
    }

    toast({
      title: "Sukses",
      description: "Data siswa berhasil ditambahkan.",
    });

    form.reset();
    router.push("/protected/admin/dashboard");
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Tambah Data Siswa</CardTitle>
        <CardDescription>
          Masukkan informasi siswa baru ke dalam sistem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Lengkap */}
            <FormField
              control={form.control}
              name="nama_lengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Masukkan username"
                        {...field}
                        autoComplete="off"
                      />
                      {isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2
                            className="h-4 w-4 animate-spin text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      {!isCheckingUsername &&
                        username.length >= 3 &&
                        usernameAvailable === true && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600">
                            Username tersedia
                          </div>
                        )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Username harus unik dan minimal 3 karakter.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Password minimal 6 karakter.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kelas */}
            <FormField
              control={form.control}
              name="kelas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 10A, 11B, 12C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                isCheckingUsername ||
                (usernameAvailable === false && username.length >= 3)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Data Siswa"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
