import { useState } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useListEvents, useCreateEvent } from "@/erp/api-client";
import { useAuth } from "@/erp/hooks/use-auth";
import { Plus, Calendar as CalendarIcon, MapPin, Clock, Loader2, Send, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

const formatDate = (d: string | Date) => {
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return String(d); }
};
const formatTime = (d: string | Date) => {
  try { return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ""; }
};

export default function Events() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", eventDate: "", location: "", isPublic: true, imageUrl: "" });

  const { data, isLoading, refetch } = useListEvents({ schoolId });
  const createEvent = useCreateEvent();

  const events = data?.events || [];

  const handleSubmit = async () => {
    if (!form.title || !form.eventDate) {
      toast({ title: "Missing fields", description: "Title and event date are required.", variant: "destructive" });
      return;
    }
    try {
      await createEvent.mutateAsync({ data: { schoolId, title: form.title, description: form.description || undefined, eventDate: new Date(form.eventDate).toISOString(), location: form.location || undefined, isPublic: form.isPublic, imageUrl: form.imageUrl || undefined } });
      toast({ title: "Event created", description: "Event has been scheduled successfully." });
      setDialogOpen(false);
      setForm({ title: "", description: "", eventDate: "", location: "", isPublic: true, imageUrl: "" });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to create event.", variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Events & Activities" links={adminLinks}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Upcoming Events</h2>
          <p className="text-muted-foreground font-medium">Manage school events and functions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2"/> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-2xl">Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Event Title</label>
                <Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="e.g. Annual Sports Day" className="h-11 rounded-xl bg-secondary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Date & Time</label>
                  <Input type="datetime-local" value={form.eventDate} onChange={e => setForm(p => ({...p, eventDate: e.target.value}))} className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Location</label>
                  <Input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} placeholder="e.g. Main Auditorium" className="h-11 rounded-xl bg-secondary/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Description</label>
                <Textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Describe the event..." className="min-h-[100px] rounded-xl bg-secondary/50 resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Image URL (optional)</label>
                <Input value={form.imageUrl} onChange={e => setForm(p => ({...p, imageUrl: e.target.value}))} placeholder="https://..." className="h-11 rounded-xl bg-secondary/50" />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div>
                  <p className="font-bold text-sm text-foreground">Public Event</p>
                  <p className="text-xs text-muted-foreground">Show this event on the public school profile</p>
                </div>
                <Switch checked={form.isPublic} onCheckedChange={v => setForm(p => ({...p, isPublic: v}))} />
              </div>
              <Button onClick={handleSubmit} disabled={createEvent.isPending} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                {createEvent.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                Schedule Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold mb-2">No events scheduled</p>
          <p className="text-sm">Create an event to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <Card key={event.id} className="overflow-hidden rounded-2xl border-border shadow-sm flex flex-col group hover:shadow-md transition-all">
              {event.imageUrl ? (
                <div className="h-48 w-full overflow-hidden relative">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider">upcoming</div>
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                  <CalendarIcon className="w-16 h-16 text-primary/40" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary shadow-sm">upcoming</div>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <h3 className="text-xl font-bold font-display text-foreground line-clamp-2">{event.title}</h3>
                  {event.isPublic && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <Globe className="w-3 h-3" /> Public
                    </span>
                  )}
                </div>
                {event.description && <p className="text-sm text-muted-foreground font-medium mb-4 line-clamp-2">{event.description}</p>}
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-2 text-primary" /> {formatDate(event.eventDate)}
                  </div>
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2 text-primary" /> {formatTime(event.eventDate)}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary" /> {event.location}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
