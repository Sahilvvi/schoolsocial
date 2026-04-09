import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, CreditCard, BookOpen, Bell, Settings } from "lucide-react";
import AttendanceModule from "./AttendanceModule";
import FeeModule from "./FeeModule";
import HomeworkModule from "./HomeworkModule";

interface Props { schoolId: string; }

export default function ErpDashboard({ schoolId }: Props) {
  const modules = [
    { value: "attendance", label: "Attendance", icon: ClipboardCheck },
    { value: "fees", label: "Fees", icon: CreditCard },
    { value: "homework", label: "Homework & Notes", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="attendance">
        <TabsList className="flex gap-1 h-auto bg-transparent p-0 w-full justify-start overflow-x-auto mb-6">
          {modules.map((m) => (
            <TabsTrigger key={m.value} value={m.value} className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-semibold text-sm px-5 py-3 shrink-0">
              <m.icon className="h-4 w-4" />{m.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="attendance"><AttendanceModule schoolId={schoolId} /></TabsContent>
        <TabsContent value="fees"><FeeModule schoolId={schoolId} /></TabsContent>
        <TabsContent value="homework"><HomeworkModule schoolId={schoolId} /></TabsContent>
      </Tabs>
    </div>
  );
}
