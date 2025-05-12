import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const cardItem = [
  {
    title: "Multiple Question Types",
    description:
      "Create exams with multiple choice, single choice, and text answer questions.",
    icon: CheckCircle,
  },
  {
    title: "Timed Exams",
    description:
      "Set time limits for exams and get automatic submissions when time runs out.",
    icon: Clock,
  },
  {
    title: "Instant Results",
    description: "Get instant feedback and results after submitting your exam.",
    icon: Award,
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* header section */}
      <section className=" flex flex-col items-center justify-center container max-w-3xl relative overflow-hidden h-[calc(100vh-114px)]">
        <div className="flex flex-col items-center justify-center space-y-4  container max-w-3xl relative overflow-hidden">
          <div>
            <BookOpen size={100} />
            <h1 className="text-balance text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 mt-6 max-w-3xl">
              Online Exam Platform
            </h1>
            <p className="mb-8 max-w-2xl md:text-lg text-primary/80">
              Create, manage, and take exams online with our easy-to-use
              platform. Perfect for educators and students.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="inline-flex items-center justify-center border whitespace-nowrap transition-all cursor-pointer bg-primary text-primary-foreground hover:bg-primary/85 h-9 px-4 gap-3 rounded-lg text-lg font-bold"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* fitur section */}
      <section className="relative py-12 md:py-24 lg:py-32">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-3">Features</h1>
            <p className="max-w-[500px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed mx-auto bg-gray-100 bg rounded-lg">
              Our platform offers everything you need for online exams
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {cardItem.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title}>
                  <CardHeader className="flex flex-col items-center space-y-2">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="text-center">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
