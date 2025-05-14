"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addPelajaran } from "@/app/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  nama_pelajaran: z.string().min(1, {
    message: "Nama pelajaran harus diisi",
  }),
});

export default function PelajaranForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_pelajaran: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("nama_pelajaran", values.nama_pelajaran);

      const result = await addPelajaran(formData);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Berhasil",
        description: "Data pelajaran berhasil ditambahkan",
      });

      // Reset form
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Tambah Data Pelajaran</CardTitle>
        <CardDescription>
          Masukkan informasi pelajaran baru ke dalam sistem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nama_pelajaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pelajaran</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Matematika" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Data Pelajaran"
              )}
            </Button>
          </form>
        </Form>
        <Toaster />
      </CardContent>
    </Card>
  );
}
