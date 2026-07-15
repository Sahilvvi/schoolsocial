import { useOutletContext } from "react-router-dom";
import { CreditCard, Crown, Check, Star, Zap, Shield } from "lucide-react";

const PLANS = [
  {
    name: "Free", price: "₹0", period: "/forever", current: true,
    features: ["Basic school profile", "Up to 5 photos", "Receive enquiries", "Basic analytics"],
    color: "border-gray-200",
  },
  {
    name: "Premium", price: "₹999", period: "/month", current: false, popular: true,
    features: ["Verified badge", "Unlimited photos & videos", "Priority listing in search", "Advanced analytics", "Social feed posting", "Blog publishing", "Featured on homepage", "Dedicated support"],
    color: "border-blue-500",
  },
  {
    name: "Enterprise", price: "₹2,499", period: "/month", current: false,
    features: ["Everything in Premium", "ERP integration", "Custom branding", "API access", "Multi-branch support", "Priority support", "Custom reports", "White-label option"],
    color: "border-purple-500",
  },
];

export default function SPSubscription() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" /> Subscription
        </h1>
        <p className="text-sm text-gray-500 mt-1">Upgrade your plan to unlock more features</p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="h-6 w-6 text-yellow-300" />
          <h2 className="text-lg font-bold">Current Plan: Free</h2>
        </div>
        <p className="text-white/70 text-sm">Upgrade to Premium to boost your school's visibility and get more enquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`bg-white border-2 ${plan.color} rounded-xl p-5 relative`}>
            {"popular" in plan && plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
              <div className="mt-1">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> {f}
                </div>
              ))}
            </div>
            <button className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              plan.current
                ? "bg-gray-100 text-gray-500 cursor-default"
                : "popular" in plan && plan.popular
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-900 text-white hover:bg-gray-800"
            }`}>
              {plan.current ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
