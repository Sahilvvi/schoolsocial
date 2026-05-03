import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  bucket?: string;
  folder?: string;
  onUpload: (url: string) => void;
  multiple?: boolean;
  onMultiUpload?: (urls: string[]) => void;
  className?: string;
}

export default function ImageUpload({ bucket = "school-images", folder = "uploads", onUpload, multiple = false, onMultiUpload, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) { toast.error("File too large (max 5MB)"); continue; }
        const ext = file.name.split(".").pop();
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      if (multiple && onMultiUpload) {
        onMultiUpload(urls);
      } else if (urls.length > 0) {
        onUpload(urls[0]);
        setPreview(urls[0]);
      }
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
      {preview ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/30">
          <img src={preview} alt="Uploaded" className="w-full h-full object-cover" />
          <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 bg-background/80 rounded-full" onClick={() => { setPreview(null); }}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" className="w-full h-24 rounded-xl border-dashed border-2 border-border/40 flex flex-col gap-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-5 w-5" /><span className="text-xs">{multiple ? "Upload Images" : "Upload Image"}</span></>}
        </Button>
      )}
    </div>
  );
}
