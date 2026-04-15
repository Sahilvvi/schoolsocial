import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { DUMMY_SCHOOL_VIEWS } from "@/data/dummyData";

export default function SPAnalytics() {
  const { school } = useOutletContext<any>();

  const { data: views = [] } = useQuery({
    queryKey: ["sp-analytics-views", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("school_views").select("viewed_at").eq("school_id", school.id);
      if (data && data.length > 0) return data;
      return DUMMY_SCHOOL_VIEWS.filter((v) => v.school_id === school.id);
    },
  });

  // Last 14 days chart
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 13 - i));
    const label = format(date, "dd MMM");
    const count = views.filter(v => {
      const vd = startOfDay(new Date(v.viewed_at));
      return vd.getTime() === date.getTime();
    }).length;
    return { date: label, views: count };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Views</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{views.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Last 7 Days</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {views.filter(v => new Date(v.viewed_at) > subDays(new Date(), 7)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Today</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {views.filter(v => startOfDay(new Date(v.viewed_at)).getTime() === startOfDay(new Date()).getTime()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Views — Last 14 Days</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
