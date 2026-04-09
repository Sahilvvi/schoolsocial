import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Trash2, Loader2 } from "lucide-react";

export default function SPGallery() {
  const { school } = useOutletContext<any>();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const gallery: string[] = school.gallery || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${school.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("school-images").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("school-images").getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }
      const updated = [...gallery, ...newUrls];
      const { error } = await supabase.from("schools").update({ gallery: updated }).eq("id", school.id);
      if (error) throw error;
      school.gallery = updated;
      qc.invalidateQueries({ queryKey: ["school", school.slug] });
      toast.success(`${newUrls.length} image(s) uploaded`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (url: string) => {
    const updated = gallery.filter(u => u !== url);
    const { error } = await supabase.from("schools").update({ gallery: updated }).eq("id", school.id);
    if (error) { toast.error(error.message); return; }
    school.gallery = updated;
    qc.invalidateQueries({ queryKey: ["school", school.slug] });
    toast.success("Image removed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <label>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          <Button asChild disabled={uploading}>
            <span>{uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}Upload Images</span>
          </Button>
        </label>
      </div>

      {gallery.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No images yet. Upload your school photos!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((url, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-border/30">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
