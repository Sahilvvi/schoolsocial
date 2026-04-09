import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function StarRating({ rating, max = 5, size = 16, interactive, onChange }: {
  rating: number; max?: number; size?: number; interactive?: boolean; onChange?: (r: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <motion.div
          key={i}
          whileHover={interactive ? { scale: 1.3 } : undefined}
          whileTap={interactive ? { scale: 0.9 } : undefined}
        >
          <Star
            className={`${interactive ? "cursor-pointer" : ""} transition-all duration-200`}
            style={{ width: size, height: size }}
            fill={i < rating ? "hsl(var(--primary))" : "transparent"}
            stroke={i < rating ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        </motion.div>
      ))}
    </div>
  );
}
