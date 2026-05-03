import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, IndianRupee, Clock, ChevronRight, Building2 } from "lucide-react";
import { useJobs } from "@/hooks/useData";

export default function TPJobs() {
  const { data: jobs = [] } = useJobs();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Find Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse teaching opportunities matching your skills</p>
        </div>
        <Link to="/jobs">
          <Button variant="outline" className="rounded-lg gap-1">View All <ChevronRight className="h-4 w-4" /></Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground">No jobs available currently.</p>
          <Link to="/jobs"><Button className="mt-4 rounded-xl gradient-primary border-0">Browse All Jobs</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <Card key={job.id} className="border-border/30 hover:border-primary/20 transition-colors group">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-primary transition-colors text-lg">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.school_name}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      <Badge className="gradient-primary text-primary-foreground border-0 rounded-lg text-xs">{job.type}</Badge>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{job.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 shrink-0 gap-1"
                  onClick={() => window.open(`/jobs`, "_self")}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
