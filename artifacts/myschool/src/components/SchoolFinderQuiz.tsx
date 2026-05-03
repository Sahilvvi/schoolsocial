import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, MapPin, GraduationCap, DollarSign,
  School, BookOpen, ChevronRight, CheckCircle2, ArrowLeft, Zap
} from "lucide-react";

const STEPS = [
  {
    id: "area",
    question: "Where are you looking for a school?",
    icon: MapPin,
    options: [
      { label: "Loni, Ghaziabad", value: "Loni", icon: "📍" },
      { label: "New Delhi", value: "Delhi", icon: "🏙️" },
      { label: "Noida", value: "Noida", icon: "🌆" },
      { label: "Gurgaon", value: "Gurgaon", icon: "🏢" },
    ],
  },
  {
    id: "board",
    question: "Which curriculum do you prefer?",
    icon: BookOpen,
    options: [
      { label: "CBSE", value: "CBSE", icon: "📚" },
      { label: "ICSE", value: "ICSE", icon: "🎓" },
      { label: "State Board", value: "State Board", icon: "📖" },
      { label: "IB / IGCSE", value: "IB", icon: "🌍" },
    ],
  },
  {
    id: "grade",
    question: "Which grade is your child in?",
    icon: GraduationCap,
    options: [
      { label: "Nursery – KG", value: "nursery", icon: "🌱" },
      { label: "Class 1 – 5", value: "primary", icon: "🏫" },
      { label: "Class 6 – 8", value: "middle", icon: "📝" },
      { label: "Class 9 – 12", value: "high", icon: "🎯" },
    ],
  },
  {
    id: "budget",
    question: "What is your annual fee budget?",
    icon: DollarSign,
    options: [
      { label: "Under ₹30,000", value: "30000", icon: "💚" },
      { label: "₹30K – ₹75K", value: "75000", icon: "💛" },
      { label: "₹75K – ₹1.5L", value: "150000", icon: "🟠" },
      { label: "No budget limit", value: "500000", icon: "💜" },
    ],
  },
];

export default function SchoolFinderQuiz({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step) / STEPS.length) * 100;

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [current.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      // Build query and navigate
      const params = new URLSearchParams();
      if (newAnswers.board) params.set("board", newAnswers.board);
      if (newAnswers.area) params.set("q", newAnswers.area);
      if (newAnswers.budget) params.set("maxFee", newAnswers.budget);
      navigate(`/schools?${params.toString()}`);
      onClose?.();
    } else {
      setStep(step + 1);
    }
  };

  const Icon = current.icon;

  return (
    <div className="relative overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 w-full bg-muted/40 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress + (100 / STEPS.length)}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step counter */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button onClick={() => { setStep(step - 1); setSelected(null); }} className="h-8 w-8 rounded-full border border-border/40 flex items-center justify-center hover:bg-muted/50 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {step + 1} of {STEPS.length}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-6 bg-primary" : "w-1.5 bg-muted/50"}`} />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-foreground leading-tight">{current.question}</h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {current.options.map((opt) => (
              <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(opt.value)}
                className={`relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selected === opt.value
                    ? "border-primary bg-primary/8 shadow-lg shadow-primary/10"
                    : "border-border/40 hover:border-primary/40 bg-card/60 hover:bg-muted/30"
                }`}>
                <span className="text-2xl">{opt.icon}</span>
                <span className={`text-sm font-bold ${selected === opt.value ? "text-primary" : "text-foreground"}`}>{opt.label}</span>
                {selected === opt.value && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next / Find button */}
      <motion.button
        whileHover={selected ? { scale: 1.02 } : {}}
        whileTap={selected ? { scale: 0.97 } : {}}
        onClick={handleNext}
        disabled={!selected}
        className={`mt-6 w-full gradient-primary text-white font-extrabold text-base rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-opacity ${!selected ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}>
        {isLast ? (
          <><Sparkles className="h-5 w-5" /> Find My Perfect Schools</>
        ) : (
          <>Next <ChevronRight className="h-5 w-5" /></>
        )}
      </motion.button>
    </div>
  );
}
