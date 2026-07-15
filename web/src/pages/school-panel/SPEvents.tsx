import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DUMMY_EVENTS } from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

export default function SPEvents() {
  const { school } = useOutletContext<any>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", location: "", event_date: "", image: "" });

  const queryKey = ["sp-events-full", school.id];

  const { data: events = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isDemoUserId(user?.id)) {
        const stored = getDemoData<any[] | null>("sp-events", null);
        if (stored) return stored;
        const fallback = DUMMY_EVENTS.filter((e) => e.school_id === school.id);
        setDemoData("sp-events", fallback);
        return fallback;
      }
      const { data } = await supabase.from("events").select("*").eq("school_id", school.id).order("event_date", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_EVENTS.filter((e) => e.school_id === school.id);
    },
  });

  const createEvent = useMutation({
    mutationFn: async (ev: any) => {
      const payload = { ...ev, school_id: school.id, school_name: school.name };
      if (isDemoUserId(user?.id)) {
        if (editing) {
          qc.setQueryData<any[]>(queryKey, (old = []) =>
            old.map(item => item.id === editing.id ? { ...item, ...payload } : item),
          );
        } else {
          const fake = { ...payload, id: `demo-${Date.now()}`, is_public: true, created_at: new Date().toISOString() };
          qc.setQueryData<any[]>(queryKey, (old = []) => [fake, ...old]);
        }
        return;
      }
      if (editing) {
        const { error } = await supabase.from("events").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>(queryKey);
        if (current) setDemoData("sp-events", current);
      } else {
        qc.invalidateQueries({ queryKey });
      }
      toast.success(editing ? "Event updated" : "Event created");
      resetForm();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      if (isDemoUserId(user?.id)) {
        qc.setQueryData<any[]>(queryKey, (old = []) => old.filter(item => item.id !== id));
        return;
      }
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>(queryKey);
        if (current) setDemoData("sp-events", current);
      } else {
        qc.invalidateQueries({ queryKey });
      }
      toast.success("Event deleted");
    },
  });

  const resetForm = () => {
    setForm({ title: "", description: "", location: "", event_date: "", image: "" });
    setEditing(null);
    setOpen(false);
  };

  const startEdit = (e: any) => {
    setEditing(e);
    setForm({ title: e.title, description: e.description || "", location: e.location || "", event_date: e.event_date, image: e.image || "" });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.event_date) { toast.error("Title and date are required"); return; }
    createEvent.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Event" : "Create Event"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Event title" /></div>
              <div><Label>Date *</Label><Input type="date" value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Event location" /></div>
              <div><Label>Image URL</Label><Input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Event details..." rows={3} /></div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={createEvent.isPending}>{editing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(e => (
            <Card key={e.id} className="border-border/30 group">
              <CardContent className="pt-6">
                {e.image && <img src={e.image} alt={e.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{e.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      📅 {format(new Date(e.event_date), "dd MMM yyyy")} {e.location && `• 📍 ${e.location}`}
                    </p>
                    {e.description && <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{e.description}</p>}
                    <Badge variant={e.is_public ? "default" : "secondary"} className="mt-2 text-xs">
                      {e.is_public ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(e)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteEvent.mutate(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
