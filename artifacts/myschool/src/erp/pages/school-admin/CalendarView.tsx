import { useState } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { useListEvents } from "@/erp/api-client";
import { useAuth } from "@/erp/hooks/use-auth";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const EVENT_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-indigo-500",
];

export default function CalendarView() {
  const { user } = useAuth();
  const schoolId = user?.schoolId || 1;
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const { data, isLoading } = useListEvents({ schoolId });
  const events = data?.events || [];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => { setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDay(today.getDate()); };

  const getEventsForDay = (day: number) => {
    return events.filter((e: any) => {
      const d = new Date(e.eventDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const allDays: { day: number; currentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) allDays.push({ day: daysInPrevMonth - i, currentMonth: false });
  for (let i = 1; i <= daysInMonth; i++) allDays.push({ day: i, currentMonth: true });
  const remaining = 42 - allDays.length;
  for (let i = 1; i <= remaining; i++) allDays.push({ day: i, currentMonth: false });

  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const upcomingEvents = events
    .filter((e: any) => new Date(e.eventDate) >= new Date(today.setHours(0,0,0,0)))
    .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5);

  return (
    <AdminLayout title="School Calendar" links={adminLinks}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-border dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-secondary dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-lg font-bold dark:text-white">{MONTHS[month]} {year}</h2>
                  <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-secondary dark:hover:bg-gray-700 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={goToday} className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">Today</button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-bold text-muted-foreground py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {allDays.map((cell, idx) => {
                  const dayEvents = cell.currentMonth ? getEventsForDay(cell.day) : [];
                  const isSelected = cell.currentMonth && selectedDay === cell.day;
                  return (
                    <button
                      key={idx}
                      onClick={() => { if (cell.currentMonth) setSelectedDay(cell.day); }}
                      className={`relative min-h-[68px] p-1.5 rounded-xl text-left transition-all group ${
                        !cell.currentMonth ? "opacity-30 cursor-default" :
                        isSelected ? "bg-primary text-white shadow-md shadow-primary/25" :
                        isToday(cell.day) && cell.currentMonth ? "bg-primary/10 ring-2 ring-primary" :
                        "hover:bg-secondary dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className={`text-xs font-bold block mb-1 ${isSelected ? "text-white" : isToday(cell.day) && cell.currentMonth ? "text-primary" : "text-foreground dark:text-gray-200"}`}>
                        {cell.day}
                      </span>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((e: any, i: number) => (
                          <div key={e.id} className={`h-1.5 rounded-full ${EVENT_COLORS[i % EVENT_COLORS.length]} ${isSelected ? "opacity-70" : ""}`} />
                        ))}
                        {dayEvents.length > 2 && (
                          <span className={`text-[9px] font-bold ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>+{dayEvents.length - 2}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedDay && (
            <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="p-4 border-b border-border dark:border-gray-700">
                <h3 className="font-bold dark:text-white">{MONTHS[month].slice(0, 3)} {selectedDay}</h3>
                <p className="text-xs text-muted-foreground">{selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="p-4">
                {selectedEvents.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No events this day</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedEvents.map((e: any, i: number) => (
                      <div key={e.id} className="flex gap-3">
                        <div className={`w-1 rounded-full shrink-0 ${EVENT_COLORS[i % EVENT_COLORS.length]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm dark:text-white truncate">{e.title}</p>
                          {e.location && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{e.location}</p>}
                          {e.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{e.description}</p>}
                          {e.isPublic && <Badge variant="secondary" className="text-[9px] mt-1 rounded-full">Public</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-border dark:border-gray-700">
              <h3 className="font-bold dark:text-white flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />Upcoming Events</h3>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">{[0,1,2].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((e: any, i: number) => {
                    const d = new Date(e.eventDate);
                    const isThisMonth = d.getMonth() === month && d.getFullYear() === year;
                    return (
                      <button
                        key={e.id}
                        onClick={() => {
                          if (isThisMonth) { setSelectedDay(d.getDate()); }
                          else { setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1)); setSelectedDay(d.getDate()); }
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <div className={`w-9 h-9 rounded-xl ${EVENT_COLORS[i % EVENT_COLORS.length]} flex flex-col items-center justify-center shrink-0`}>
                          <span className="text-white text-[9px] font-bold leading-none">{MONTHS[d.getMonth()].slice(0,3).toUpperCase()}</span>
                          <span className="text-white text-sm font-bold leading-none">{d.getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold dark:text-white truncate">{e.title}</p>
                          {e.location && <p className="text-xs text-muted-foreground truncate">{e.location}</p>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
