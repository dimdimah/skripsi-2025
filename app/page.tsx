import Hero from "@/components/hero";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KelasForm from "@/components/kelas-form";
import PelajaranForm from "@/components/pelajaran-form";
import StudentsForm from "@/components/students-form";

export default async function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Form Input Data</h1>

        <Tabs defaultValue="kelas" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="kelas">Kelas</TabsTrigger>
            <TabsTrigger value="pelajaran">Pelajaran</TabsTrigger>
            <TabsTrigger value="students">Siswa</TabsTrigger>
          </TabsList>

          <TabsContent value="kelas" className="p-4 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Form Input Kelas</h2>
            <KelasForm />
          </TabsContent>

          <TabsContent value="pelajaran" className="p-4 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Form Input Pelajaran
            </h2>
            <PelajaranForm />
          </TabsContent>

          <TabsContent value="students" className="p-4 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Form Input Siswa</h2>
            <StudentsForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
