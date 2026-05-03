import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { School, Upload, CheckCircle, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters").max(100),
  location: z.string().min(3, "Location is required").max(200),
  board: z.string().min(1, "Select a board"),
  fees: z.string().min(1, "Enter fee range"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
  about: z.string().max(2000).optional(),
});

type FormData = z.infer<typeof schema>;

const boards = ["CBSE", "ICSE", "IB", "Cambridge", "State Board", "IGCSE"];

export default function UploadSchoolPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", location: "", board: "", fees: "", description: "", about: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) { toast.error("Please sign in first"); navigate("/auth"); return; }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    try {
      const { error } = await supabase.from("schools").insert({
        name: data.name,
        slug,
        location: data.location,
        board: data.board,
        fees: data.fees,
        description: data.description,
        about: data.about || data.description,
        banner: bannerUrl,
        gallery: galleryUrls,
        is_verified: false,
        is_featured: false,
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast.success("School submitted for review!");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold mb-3">School Submitted!</h1>
          <p className="text-muted-foreground mb-6">Your school has been submitted for review. Once verified, it will appear with a verified badge. We may visit your school or verify documents online.</p>
          <Button onClick={() => navigate("/schools")} className="rounded-xl gradient-primary border-0">View Schools</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Upload className="h-3.5 w-3.5" /> For Principals
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold mb-4">
            List Your <span className="text-gradient">School</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg max-w-xl mx-auto">
            Add your school with basic details for free. Get verified and unlock premium features.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/60 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><School className="h-5 w-5 text-primary" /> School Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>School Name *</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" placeholder="e.g. Delhi Public School" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location *</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" placeholder="e.g. Sector 30, Noida" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="board" render={({ field }) => (
                      <FormItem><FormLabel>Board *</FormLabel><FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="rounded-xl bg-accent/20 border-border/30"><SelectValue placeholder="Select board" /></SelectTrigger>
                          <SelectContent>{boards.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="fees" render={({ field }) => (
                    <FormItem><FormLabel>Fee Range *</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" placeholder="e.g. ₹80,000/year" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Short Description *</FormLabel><FormControl><Textarea rows={3} className="rounded-xl bg-accent/20 border-border/30" placeholder="Brief description of your school..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="about" render={({ field }) => (
                    <FormItem><FormLabel>About (Optional)</FormLabel><FormControl><Textarea rows={4} className="rounded-xl bg-accent/20 border-border/30" placeholder="Detailed information about your school..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">School Banner Image</p>
                    <ImageUpload folder="banners" onUpload={setBannerUrl} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Gallery Images (optional)</p>
                    <ImageUpload folder="gallery" multiple onUpload={() => {}} onMultiUpload={(urls) => setGalleryUrls((prev) => [...prev, ...urls])} />
                    {galleryUrls.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {galleryUrls.map((url, i) => (
                          <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover border border-border/30" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-accent/30 border border-border/30 text-sm text-muted-foreground space-y-2">
                    <p className="font-medium text-foreground">What happens next?</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your school will be listed with basic details</li>
                      <li>Our team will verify your school (visit or online documents)</li>
                      <li>Once verified, you get the blue tick badge</li>
                      <li>Choose a plan to unlock premium features like photo gallery, admission forms, job posting, and more</li>
                    </ul>
                  </div>

                  {!user && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                      Please <a href="/auth" className="underline font-semibold">sign in</a> first to submit your school.
                    </div>
                  )}

                  <Button type="submit" className="w-full rounded-xl gradient-primary border-0 h-12 shadow-lg shadow-primary/20" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : "Submit School"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
