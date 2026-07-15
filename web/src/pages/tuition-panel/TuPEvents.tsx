import { CalendarDays, MapPin, Clock, Users, Plus, Filter } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    description: "Quarterly progress discussion for all batches. Parents can meet individual subject teachers.",
    date: "15 Jun 2024",
    time: "10:00 AM - 2:00 PM",
    venue: "Main Center Hall",
    attendees: 45,
    status: "upcoming" as const,
    type: "Meeting",
  },
  {
    id: 2,
    title: "Demo Class — JEE Foundation",
    description: "Free demo class for Class 11th students interested in JEE preparation.",
    date: "8 Jun 2024",
    time: "11:00 AM - 12:30 PM",
    venue: "Classroom A3",
    attendees: 20,
    status: "upcoming" as const,
    type: "Demo Class",
  },
  {
    id: 3,
    title: "Science Quiz Competition",
    description: "Inter-batch science quiz for Class 8-10 students with exciting prizes.",
    date: "22 Jun 2024",
    time: "3:00 PM - 5:00 PM",
    venue: "Main Center Hall",
    attendees: 60,
    status: "upcoming" as const,
    type: "Competition",
  },
  {
    id: 4,
    title: "Board Exam Result Celebration",
    description: "Celebrating our students' outstanding Board Exam results. Top performers will be felicitated.",
    date: "20 May 2024",
    time: "5:00 PM - 7:00 PM",
    venue: "Main Center Hall",
    attendees: 80,
    status: "completed" as const,
    type: "Celebration",
  },
  {
    id: 5,
    title: "Summer Workshop — Vedic Maths",
    description: "Special 3-day workshop on Vedic Mathematics techniques for quick calculations.",
    date: "5 May 2024",
    time: "9:00 AM - 12:00 PM",
    venue: "Classroom B1",
    attendees: 25,
    status: "completed" as const,
    type: "Workshop",
  },
];

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export default function TuPEvents() {
  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            Events & Activities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage center events, workshops, and activities</p>
        </div>
        <div className="flex gap-2">
          <button className="border rounded-xl px-3 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4" /> New Event
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                {event.type}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[event.status]}`}>
                {event.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{event.title}</h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" /> {event.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {event.venue}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> {event.attendees} attendees
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
