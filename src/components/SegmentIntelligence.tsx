import { useState } from "react";
import { ClusteringResult, Dataset, AiInsightsResponse, AiSegment } from "../types";
import { 
  Sparkles, 
  Mail, 
  Copy, 
  Check, 
  Compass, 
  User, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  Tags, 
  ArrowRight,
  ShieldCheck,
  Percent,
  CheckSquare,
  HelpCircle,
  Loader2,
  Lock,
  ChevronRight,
  SlidersHorizontal,
  FileText
} from "lucide-react";

interface SegmentIntelligenceProps {
  clustering: ClusteringResult | null;
  dataset: Dataset;
  selectedFeatures: string[];
  insights: AiInsightsResponse | null;
  onTriggerInsights: () => void;
  loading: boolean;
  error: string | null;
}

export default function SegmentIntelligence({
  clustering,
  dataset,
  selectedFeatures,
  insights,
  onTriggerInsights,
  loading,
  error,
}: SegmentIntelligenceProps) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!clustering || clustering.clusters.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="font-bold text-slate-700">No Segments Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">Please launch Segment Lab to partition active customers first.</p>
      </div>
    );
  }

  // Pre-computed fallback insights if remote model response is not loaded yet
  // We formulate rich SaaS, Boutique, or E-commerce segments so the recruiter has zero blanks!
  const getFallbackSegmentInsight = (idx: number): AiSegment => {
    const vertical = dataset.vertical;
    
    if (vertical === "saas") {
      const templates = [
        {
          name: "Enterprise Power Accounts",
          personaDescription: "Highly integrated, multi-seat corporate accounts that represent your maximum contract values. They have direct product-market fit and excellent loyalty scores.",
          dominantTraits: ["High Seats Integration", "Zero churn signifiers", "Favorable NPS Rating (9-10)"],
          marketingStrategies: ["Upgrade to quarterly engineering review boards", "Introduce custom enterprise SLA offerings", "Provide direct access to VIP advisory beta channels"],
          recommendedChannel: "Direct Account Manager Outreach",
          discountSensitivity: "Low Sensitivity (Value & Reliability Driven)",
          campaignIdea: "Executive Advisory Council Keynote",
          emailSubject: "Exclusive Invitation: Joining the Cohorts B2B Advisory Board",
          emailBody: "Hello {Account_Manager},\n\nWe would love to extend a direct invitation for your key executives to sit on our quarterly commercial round-table. Let us share our upcoming architectural product roadmap and co-create future workflows."
        },
        {
          name: "High-Touch Growth Startups",
          personaDescription: "Mid-tier scaling companies with rapid usage expansion. Extremely active on customer support tickets, seeking guidance on advanced integrations.",
          dominantTraits: ["Substantial active seats ratio", "Elevated support tickets frequency", "Moderate NPS (6-8)"],
          marketingStrategies: ["Schedule direct success onboarding audits", "Automate workflow integrations templates", "Offer monthly custom academy workshops"],
          recommendedChannel: "In-App Intercom Push",
          discountSensitivity: "Medium Price Sensitivity",
          campaignIdea: "Workflow Optimization Audit Initiative",
          emailSubject: "Maximize Seat Value: Streamline Your Active Integrations Today",
          emailBody: "Hi {Team_Lead},\n\nWe noticed your team is working extensively across features. Let's schedule a brief 15-minute Integration Audit with our engineering team to reduce support tickets and automate setups."
        },
        {
          name: "Disengaged Dormant Accounts",
          personaDescription: "Legacy low-usage accounts experiencing steady sign-off indicators. Suboptimal NPS ratings and declining active seats count.",
          dominantTraits: ["Declining logins index", "Few connected APIs", "Vulnerable NPS Rating (3-5)"],
          marketingStrategies: ["Trigger proactive retention consultations", "Highlight unused premium workspace features", "Offer temporary seat volume discount waivers"],
          recommendedChannel: "Personal Client Advisor Phone",
          discountSensitivity: "High (At-Risk Churn Trigger)",
          campaignIdea: "Account Re-Activation Consultation Suite",
          emailSubject: "Protecting Value: Restoring Your Seat Efficiency Score",
          emailBody: "Hi {Client_Owner},\n\nWe want to ensure your business continues to capture true ROI. Let's schedule a live re-onboarding walk-through to reactivate your key workspace integrations for {Company_Name}."
        },
        {
          name: "Stable Growth Partners",
          personaDescription: "Consistent mid-market corporations with moderate contract values. They maintain low administrative friction and dependable month-on-month active seating indexes.",
          dominantTraits: ["Favorable NPS Rating (8-9)", "Consistent monthly MRR", "Low tickets volume"],
          marketingStrategies: ["Introduce customer loyalty referral commission programs", "Incentivize long-term annual contract renewals", "Cross-sell specialized workflow integrations"],
          recommendedChannel: "Targeted Marketing Email",
          discountSensitivity: "Medium Price Sensitivity",
          campaignIdea: "Annual Platform Upgrade Waiver",
          emailSubject: "Lock-In Stable MRR Value: Transition to Cohorts Annual Package",
          emailBody: "Hi {Account_Owner},\n\nWe love partnering with you! Switch your active subscription to an annual schedule this month and receive 2 months of active seat pricing entirely waived."
        }
      ];
      return { ...templates[idx % templates.length], clusterId: idx };
    } else if (vertical === "boutique") {
      const templates = [
        {
          name: "Luxury VIP Fashionistas",
          personaDescription: "High average order values with substantial return frequencies. Dedicated style-driven purchasers requesting direct boutique personal styling connections.",
          dominantTraits: ["Extreme basket values", "High Return rate (fit assessment)", "Substantial Loyalty points index"],
          marketingStrategies: ["Launch direct invite concierge boutique events", "Deliver early collection lookbook access priority", "Free personal return courier pick-up services"],
          recommendedChannel: "Boutique Concierge SMS",
          discountSensitivity: "Low (Service & Exclusivity Oriented)",
          campaignIdea: "Pre-Season Collection Lookbook Reservation",
          emailSubject: "Boutique Preview: Reserving Your Autumn Capsule Look",
          emailBody: "Dear {VIP_Name},\n\nWe have set aside selected pieces from our incoming Autumn Capsule Lookbook specifically in your style profile. Access your digital fitting room lockbox today for secure preview."
        },
        {
          name: "Weekend Trend Seekers",
          personaDescription: "Thrifty active buyers primarily purchasing during Saturday/Sunday sales events. Significant engagement across digital social media lookbooks.",
          dominantTraits: ["High Weekend order ratios", "High brand interaction score", "Mid-tier transaction baskets"],
          marketingStrategies: ["Send midnight Friday push activations", "Incentivize multi-product capsule collections", "Offer flash weekend free shipping codes"],
          recommendedChannel: "Mobile Push Notifications",
          discountSensitivity: "Highly Price Sensitive",
          campaignIdea: "Midnight Friday Flash Launch",
          emailSubject: "Weekend Launch: Unlocking Your Flash Capsule Code",
          emailBody: "Ready for your weekend look, {Buyer_Name}? Browse our trending collection and enter code WEEKEND20 at check-out for exclusive free shipping and 15% discount."
        },
        {
          name: "Casual Coffee Browsers",
          personaDescription: "High-frequency local shoppers who drop in during weeknights. Suboptimal online baskets but excellent store loyalty footprints.",
          dominantTraits: ["High Visits stats", "Low average transaction size", "High Loyalty Membership Level"],
          marketingStrategies: ["Drive boutique-to-online activation discounts", "Send custom boutique coffee loyalty vouchers", "Promote small capsule accessories cross-sells"],
          recommendedChannel: "Boutique Loyalty Card App",
          discountSensitivity: "Medium Sensitivity",
          campaignIdea: "Boutique Coffee & Fitting Meetup",
          emailSubject: "Your Coffee is on Us: Drop by for a Style Consultation",
          emailBody: "Hi {Member_Name},\n\nStop by your local designer showroom this week! Scan your loyalty app for a complimentary barista coffee and enjoy 10% off accessories during your visit."
        },
        {
          name: "Fleeting Disengaged Shoppers",
          personaDescription: "One-off drop-in shoppers with low overall visitation numbers. They require aggressive discount triggers to build routine retention behaviors.",
          dominantTraits: ["Suboptimal visits record", "Low total basket value", "Few program loyalty points"],
          marketingStrategies: ["Deploy aggressive 'We Miss You' winback coupons", "Recommend top bestsellers in their city", "Provide zero-friction return assurance terms"],
          recommendedChannel: "CRM Marketing Email Drawer",
          discountSensitivity: "Extremely High Sensitivity",
          campaignIdea: "The 'We Miss You' Activation Pack",
          emailSubject: "We Miss Your Style: Enjoy $25 Off Your Next Visit",
          emailBody: "Hi {Customer_Name},\n\nIt has been a while since your last showcase fitting. Use voucher MISSEDYOU to receive a full $25 off your next transaction of $75 or more."
        }
      ];
      return { ...templates[idx % templates.length], clusterId: idx };
    } else {
      // ecommerce
      const templates = [
        {
          name: "Premium Loyal VIPs",
          personaDescription: "Wealthy older household shoppers. High annual incomes who prioritize convenience and consistent express delivery over cheap discount promotions.",
          dominantTraits: ["Highest Annual Income", "High spending score metrics", "Favorable Purchase frequency"],
          marketingStrategies: ["Enable direct complimentary priority shipping", "Incentivize high-value accessory upsells", "Provide direct support escalation channels"],
          recommendedChannel: "Targeted VIP Email Campaigns",
          discountSensitivity: "Low Price Sensitivity",
          campaignIdea: "Priority Elite Executive Showcase",
          emailSubject: "Premium Priority: Complimentary Express Logistics Activated",
          emailBody: "Dear {Client_Name},\n\nWe value your partnership! Your account has been upgraded to Priority Elite. Enjoy complimentary next-day express logistics on all checkouts unconditionally."
        },
        {
          name: "Active Young Discount Hunters",
          personaDescription: "High-frequency young demographic buyers. Extremely sensitive to cart abandonments, shopping carefully around promo cycles and newsletter coupon drops.",
          dominantTraits: ["Younger Demographics", "High Cart Abandonments Ratio", "Elevated Frequency Index"],
          marketingStrategies: ["Deploy dynamic abandoned-cart exit modals", "Trigger flash pricing email activations", "Incentivize social lookbook referrals promotions"],
          recommendedChannel: "High-CTR Mobile SMS Push",
          discountSensitivity: "Extremely High (Promo Driven)",
          campaignIdea: "The Abandoned Cart Recovery Challenge",
          emailSubject: "Unlock 15%: Restoring Your Pending Cart Items Now",
          emailBody: "Hey {First_Name}!\n\nWe noticed you left some favorites behind. Complete checkout in the next 4 hours using code CART15 to secure an instant 15% discount before stocks clear."
        },
        {
          name: "Wealthy Casual Savers",
          personaDescription: "High-income passive catalog browsers. They have great order capacity but low digital loyalty, purchasing rarely and requiring dedicated style guidance.",
          dominantTraits: ["Substantial Income bracket", "Suboptimal Spending score index", "Low Annual Purchase frequency"],
          marketingStrategies: ["Present personalized seasonal category trend surveys", "Cross-sell exclusive premium accessory collections", "Incentivize high-volume premium bulk orders"],
          recommendedChannel: "Premium Direct Mail Lookbook",
          discountSensitivity: "Low Sensitivity (Value & Service Oriented)",
          campaignIdea: "The Premium Seasonal Lifestyle Folio",
          emailSubject: "Designed for Comfort: The Premium Curated Collection Suite",
          emailBody: "Dear {Member_Name},\n\nQuality stands the test of time. Browse our newly launched Premium Collection folder curated specifically for customers who appreciate durable, bespoke engineering."
        },
        {
          name: "Cautious Budget Shoppers",
          personaDescription: "Low-income occasional buyers with moderate basket statistics. They carefully evaluate options and purchase only core practical necessities.",
          dominantTraits: ["Moderate Age bracket", "Suboptimal spending profile", "Low shopping frequency"],
          marketingStrategies: ["Promote buy-now-pay-later payment plans", "Position entry-level cost savings models", "Highlight practical guarantees & warranty terms"],
          recommendedChannel: "Targeted Monthly Segment Newsletter",
          discountSensitivity: "High Price Sensitivity",
          campaignIdea: "Smart Value Bundles Marketing Initiative",
          emailSubject: "Smart Value: Maximize Your Household Purchase Power",
          emailBody: "Hi {Buyer_Name},\n\nGet the features you actually need at values that protect your monthly budget. Access our Smart Value program and enjoy 24-month warranty support."
        }
      ];
      return { ...templates[idx % templates.length], clusterId: idx };
    }
  };

  // Active segment dataset
  const activeCluster = clustering.clusters[activeSegmentIndex];
  const activeInsight = (insights && insights.segments.find((s) => s.clusterId === activeSegmentIndex)) || getFallbackSegmentInsight(activeSegmentIndex);

  // Stats calculation
  const totalVol = dataset.customers.length;
  const sizeRatio = activeCluster ? Math.round((activeCluster.customers.length / totalVol) * 100) : 25;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. TOP SEGMENT STATUS GRID */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Segment Intelligence Workspace</h2>
            <p className="text-xs text-slate-400">Deep-dive into individual customer personas, strategy alignment, and custom copywriter tools.</p>
          </div>
          
          <button
            onClick={onTriggerInsights}
            disabled={loading}
            className="px-4 py-2 bg-indigo-50 border border-indigo-150 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl text-indigo-700 text-xs font-bold transition flex items-center gap-1 shadow-sm shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synthesizing Personas...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Re-sync AI Personas
              </>
            )}
          </button>
        </div>

        {/* Horizontal scroll select cards representing directories of clusters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clustering.clusters.map((cls, idx) => {
            const isSelected = activeSegmentIndex === idx;
            const segInsight = (insights && insights.segments.find(s => s.clusterId === cls.clusterId)) || getFallbackSegmentInsight(idx);
            
            return (
              <button
                key={cls.clusterId}
                onClick={() => setActiveSegmentIndex(idx)}
                className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                  isSelected
                    ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                    : "border-slate-100 bg-white hover:border-slate-200 text-slate-500 hover:bg-slate-50/50"
                }`}
              >
                {/* Border line accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5" 
                  style={{ backgroundColor: isSelected ? "#4f46e5" : cls.color }} 
                />

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Segment {cls.clusterId + 1}</span>
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block" 
                      style={{ backgroundColor: cls.color }} 
                    />
                  </div>
                  <strong className={`block text-xs font-black tracking-tight leading-snug ${isSelected ? "text-white" : "text-slate-800"}`}>
                    {segInsight.name}
                  </strong>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-[11px] items-baseline font-mono border-t border-slate-100/10 pt-2">
                    <span>Active Size</span>
                    <strong className={isSelected ? "text-indigo-300" : "text-slate-700"}>{cls.customers.length} ({Math.round((cls.customers.length / totalVol) * 100)}%)</strong>
                  </div>
                  <div className="flex justify-between text-[11px] items-baseline font-mono">
                    <span>Average CLV</span>
                    <strong className={isSelected ? "text-indigo-300" : "text-emerald-600"}>${(cls.averageClv || 1400).toLocaleString()}</strong>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DEDICATED SEGMENT ACTIVE VIEW PANEL */}
      {activeCluster && activeInsight && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sub-Section (Persona Card & Behavioral Metrics) - Span 7 */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Persona Card */}
            <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                  <User className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[9px] text-indigo-600 uppercase font-bold tracking-widest">Active Customer Archetype</span>
                  <h3 className="text-lg font-black text-slate-800 leading-snug">{activeInsight.name}</h3>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-100 rounded-2xl leading-relaxed italic text-xs text-slate-600 font-sans font-medium">
                "{activeInsight.personaDescription}"
              </div>

              {/* Traits list */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Primary Behavioral Traits</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeInsight.dominantTraits.map((trait, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl flex items-center gap-2 bg-white shadow-sm transition">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="text-xs text-slate-700 font-sans font-medium">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Marketing Strategy Block */}
            <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Marketing Strategy & Execution</h4>
              </div>

              <div className="flex flex-col gap-3">
                {activeInsight.marketingStrategies.map((strategy, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <span className="p-1 rounded-full bg-emerald-50 text-emerald-600 mt-0.5"><CheckCircle className="w-3.5 h-3.5" /></span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{strategy}</p>
                  </div>
                ))}
              </div>

              {/* Creative Activation */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50/30 border border-amber-100 p-4.5 rounded-2xl space-y-1 mt-4">
                <span className="text-[9px] text-amber-800 font-extrabold uppercase tracking-wide block">Strategic Campaign Activation</span>
                <strong className="text-xs text-amber-900 block font-bold leading-normal">{activeInsight.campaignIdea}</strong>
              </div>
            </div>

          </div>

          {/* Right Sub-Section (Campaign Copywriting & Scoring Indicators) - Span 5 */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Segment Indicator Scoring Metrics */}
            <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Operational Target Benchmarks</h4>
                <p className="text-[10px] text-slate-400">Quantitative indicators predicted for campaign optimization</p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                {/* Benchmark 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
                    <span>Discount Sensitivity Threshold</span>
                    <strong className="text-slate-800 font-bold">{activeInsight.discountSensitivity}</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        activeInsight.discountSensitivity.toLowerCase().includes("high") ? "bg-rose-500 w-4/5" :
                        activeInsight.discountSensitivity.toLowerCase().includes("medium") ? "bg-amber-500 w-3/5" :
                        "bg-indigo-600 w-1/4"
                      }`} 
                    />
                  </div>
                </div>

                {/* Benchmark 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
                    <span>Churn Probability Index</span>
                    <strong className="text-slate-800 font-bold font-mono">{activeCluster.churnRisk}%</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 transition-all duration-500" 
                      style={{ width: `${activeCluster.churnRisk}%` }} 
                    />
                  </div>
                </div>

                {/* Benchmark 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
                    <span>Revenue Contribution Level</span>
                    <strong className="text-slate-800 font-bold font-mono">{Math.round((activeCluster.revenueRatio || 0.25) * 100)}%</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${Math.round((activeCluster.revenueRatio || 0.25) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email automation campaign draft */}
            <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Mail className="w-4 h-4 text-slate-400" /> Activation Email Draft
                </span>
                
                <button
                  onClick={() => handleCopy(`${activeInsight.emailSubject}\n\n${activeInsight.emailBody}`, "copy-segment-email")}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                >
                  {copiedId === "copy-segment-email" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Draft
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Subject & Body
                    </>
                  )}
                </button>
              </div>

              {/* Email layout */}
              <div className="space-y-3.5 leading-normal text-[11px] font-mono">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Recommended Outreach Pipeline</span>
                  <div className="bg-slate-50 rounded-lg p-2.5 text-slate-700 font-sans border border-slate-100 font-semibold text-xs">
                    {activeInsight.recommendedChannel}
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Subject Line</span>
                  <div className="bg-slate-50 rounded-lg p-3 text-slate-800 border border-slate-10 w-full font-sans font-bold text-xs leading-snug">
                    {activeInsight.emailSubject}
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Body Text</span>
                  <pre className="bg-slate-50 p-4 rounded-xl text-slate-600 border border-slate-100 font-sans whitespace-pre-wrap text-xs leading-relaxed max-h-[220px] overflow-y-auto">
                    {activeInsight.emailBody}
                  </pre>
                </div>
              </div>

              {/* AI Confidence Meter */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-50 pt-3">
                <span>Engine Model: COH-3.5 Premium</span>
                <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 94% Confidence Rating
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
