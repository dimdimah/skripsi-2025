import { StudentForm } from "@/components/student-form";

export default function Home() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-6">
        Sistem Manajemen Data Siswa
      </h1>
      <StudentForm />
    </main>
  );
}
