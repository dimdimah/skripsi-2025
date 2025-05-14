import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KelasForm from "@/components/kelas-form";
import PelajaranForm from "@/components/pelajaran-form";
import StudentsForm from "@/components/students-form";

export default function Home() {
  return (
    <div className="py-10 w-full">
      <h1 className="text-3xl font-bold mb-8 text-center">Form Input Data</h1>

      <Tabs defaultValue="kelas" className="max-w-4xl">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="kelas">Kelas</TabsTrigger>
          <TabsTrigger value="pelajaran">Pelajaran</TabsTrigger>
          <TabsTrigger value="students">Siswa</TabsTrigger>
        </TabsList>
        <div className="min-h-[500px] w-96">
          <TabsContent value="kelas" className="p-4 h-full">
            <KelasForm />
          </TabsContent>

          <TabsContent value="pelajaran" className="p-4 h-full">
            <PelajaranForm />
          </TabsContent>

          <TabsContent value="students" className="p-4 h-full">
            <StudentsForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
