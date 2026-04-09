import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { Plus, Trash2, Image, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }
function getUser() { try { return JSON.parse(localStorage.getItem("myschool_user") || "{}"); } catch { return {}; } }

interface GalleryImage { id: number; imageUrl: string; caption?: string; createdAt: string; }

export default function Gallery() {
  const user = getUser();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ imageUrl: "", caption: "" });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/gallery?schoolId=${user.schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setImages(d.images || []));
  }, []);

  const handleAdd = async () => {
    if (!form.imageUrl) return;
    const res = await fetch(`${BASE}/api/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ schoolId: user.schoolId, ...form }),
    });
    const data = await res.json();
    setImages(prev => [data, ...prev]);
    setOpen(false);
    setForm({ imageUrl: "", caption: "" });
    toast({ title: "Image added to gallery!" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`${BASE}/api/gallery/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    setImages(prev => prev.filter(i => i.id !== id));
    toast({ title: "Image removed" });
  };

  return (
    <AdminLayout title="School Gallery" links={adminLinks}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Gallery</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Showcase your school's facilities and events</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2"/>Add Image</Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader><DialogTitle className="dark:text-white">Add Gallery Image</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">Image URL *</Label>
                <Input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/image.jpg" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <div>
                <Label className="dark:text-gray-300">Caption</Label>
                <Input value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="Annual Sports Day 2025" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add to Gallery</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Image className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3"/>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No images yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add photos to showcase your school to parents and students</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square cursor-pointer" onClick={() => setPreview(img.imageUrl)}>
              <img src={img.imageUrl} alt={img.caption || ""} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Image"; }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={e => { e.stopPropagation(); handleDelete(img.id); }} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                  <Trash2 className="w-4 h-4"/>
                </button>
                <a href={img.imageUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100">
                  <ExternalLink className="w-4 h-4"/>
                </a>
              </div>
              {img.caption && <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 p-2"><p className="text-white text-xs truncate">{img.caption}</p></div>}
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <img src={preview} alt="Preview" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
