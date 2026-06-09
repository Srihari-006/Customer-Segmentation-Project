import { useState } from "react";
import { Dataset, ClusteringResult, AiInsightsResponse, AiSegment } from "../types";
import { jsPDF } from "jspdf";
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  BookOpen, 
  Mail, 
  Sliders, 
  ChevronRight, 
  Settings, 
  Check, 
  Loader2, 
  Printer, 
  Share2,
  Lock,
  ArrowRight
} from "lucide-react";

interface ReportingCenterProps {
  clustering: ClusteringResult | null;
  dataset: Dataset;
  insights: AiInsightsResponse | null;
}

export default function ReportingCenter({
  clustering,
  dataset,
  insights
}: ReportingCenterProps) {
  const [downloadType, setDownloadType] = useState<string | null>(null);
  const [progressBar, setProgressBar] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState<string>("Q3 Customer Intelligence Advisory");
  const [includeAI, setIncludeAI] = useState<boolean>(true);
  const [includeKPIs, setIncludeKPIs] = useState<boolean>(true);

  // Fallback segment insights mapping helper
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
          personaDescription: "Low-income occasional buyers with moderate basket statistics. They evaluate options and purchase only core practical necessities.",
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

  // Compiler for high-quality structured PDF
  const compilePDF = (): jsPDF => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    let y = 50;
    const marginX = 18;
    const colWidth = 174;

    // Header Title Area
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(customTitle.toUpperCase(), marginX, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`ENTERPRISE COHORT ADVISORY REPORT  |  COMPILED: ${new Date().toLocaleDateString()}`, marginX, 23);
    doc.text(`DATASET TARGET: ${dataset.name.toUpperCase()} (VERTICAL: ${dataset.vertical.toUpperCase()})`, marginX, 28);
    doc.text(`SECURITY LEVEL: COMMERCIAL CLASSIFIED CONFIDENTIAL`, marginX, 33);

    // Metadata section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("I. STRATEGIC CONTEXT & ADVISORY SCOPE", marginX, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // slate-700
    const summaryText = `This proprietary intelligence advisory details partitioning characteristics of the active customer cohort dataset containing a core total of ${dataset.customers.length} analyzed accounts. Using computerized distance centroids optimization (K-Means), these rows are successfully divided into ${clustering?.k || 4} unique target operational cohorts possessing different potential, engagement vectors, and marketing discount sensitivities.`;
    const splitSummary = doc.splitTextToSize(summaryText, colWidth);
    doc.text(splitSummary, marginX, y);
    y += splitSummary.length * 4.5 + 4;

    // Centroids Analysis Table
    if (includeKPIs && clustering && clustering.clusters.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("II. COHORT REVENUE & ENGAGEMENT MATRIX", marginX, y);
      y += 6;

      // Table Header Row
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(marginX, y, colWidth, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.text("ID", marginX + 2, y + 4.8);
      doc.text("COHORT CLUSTER NAME", marginX + 11, y + 4.8);
      doc.text("ACCOUNTS", marginX + 78, y + 4.8);
      doc.text("AVG CLV", marginX + 104, y + 4.8);
      doc.text("CHURN RISK", marginX + 128, y + 4.8);
      doc.text("GROWTH PCT", marginX + 152, y + 4.8);
      y += 7.5;

      // Table Data Rows
      clustering.clusters.forEach((cls) => {
        const fallbackName = getFallbackSegmentInsight(cls.clusterId).name;
        const segmentName = insights?.segments.find(s => s.clusterId === cls.clusterId)?.name || fallbackName;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`#${cls.clusterId + 1}`, marginX + 2, y + 4.5);
        
        const truncatedName = segmentName.length > 32 ? segmentName.slice(0, 29) + "..." : segmentName;
        doc.text(truncatedName, marginX + 11, y + 4.5);
        
        doc.text(`${cls.customers.length} (${Math.round((cls.customers.length / dataset.customers.length) * 100)}%)`, marginX + 78, y + 4.5);
        doc.text(`$${cls.averageClv || 0}`, marginX + 104, y + 4.5);
        doc.text(`${cls.churnRisk || 0}%`, marginX + 128, y + 4.5);
        doc.text(`+${cls.growthRate || 10}%`, marginX + 152, y + 4.5);

        // Grid separator line
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.2);
        doc.line(marginX, y + 6.5, marginX + colWidth, y + 6.5);
        y += 7;
      });

      y += 5;
    }

    // Role-Specific Playbooks Section
    if (includeAI && clustering && clustering.clusters.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("III. CONVERTIBLE MARKETING CAMPAIGNS PLAYBOOK", marginX, y);
      y += 6;

      clustering.clusters.forEach((cls) => {
        const fallback = getFallbackSegmentInsight(cls.clusterId);
        const play = insights?.segments.find(s => s.clusterId === cls.clusterId) || fallback;

        // Space check for page break
        if (y > 235) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(79, 70, 229); // indigo-600
        doc.text(`COHORT #${cls.clusterId + 1}: ${play.name.toUpperCase()}`, marginX, y);
        y += 4.5;

        // Description
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const splitDesc = doc.splitTextToSize(`Profile: ${play.personaDescription}`, colWidth);
        doc.text(splitDesc, marginX, y);
        y += splitDesc.length * 3.8 + 2;

        // Details Row
        doc.setFont("helvetica", "bold");
        doc.setTextColor(51, 65, 85);
        doc.text(`Dominant Channel: ${play.recommendedChannel}  |  Discount Sensitivity: ${play.discountSensitivity}`, marginX, y);
        y += 4;

        doc.setFont("helvetica", "semibold");
        doc.setTextColor(15, 23, 42);
        doc.text(`Recommended Direct Campaign Idea: ${play.campaignIdea}`, marginX, y);
        y += 4.5;

        // Subject & Copywriter drafts
        doc.setFillColor(250, 250, 250);
        doc.rect(marginX, y, colWidth, 18, "F");
        doc.setDrawColor(241, 245, 249);
        doc.rect(marginX, y, colWidth, 18, "D");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`SUBJECT: ${play.emailSubject}`, marginX + 3, y + 4.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const splitEmail = doc.splitTextToSize(play.emailBody.replace(/\n/g, "  "), colWidth - 6);
        doc.text(splitEmail, marginX + 3, y + 9.5);

        y += 22;
      });
    }

    // Embed Footers with verified seal
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginX, 280, marginX + colWidth, 280);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`Cohorts AI Analytics Export Center. Verified Corporate Advisory Seal 2026.`, marginX, 285);
      doc.text(`Page ${i} of ${totalPages}`, marginX + colWidth - 14, 285);
    }

    return doc;
  };

  // Compiler for high-quality comprehensive CSV Matrix
  const compileCSV = (): string => {
    let csv = "";
    
    // Header
    csv += "========================================================================\r\n";
    csv += `     COHORTS AI OPERATIONAL MATRIX EXPORT\r\n`;
    csv += `     Dataset Active: ${dataset.name.toUpperCase()}\r\n`;
    csv += `     Generation Date: ${new Date().toLocaleDateString()}\r\n`;
    csv += "========================================================================\r\n\r\n";

    // Section 1: Cohort High-Level Distribution Metrics
    csv += "SECTION 1 - ACTIVE COHORT METRIQUES OVERVIEW\r\n";
    csv += "Cohort ID,Profile Name,Active Accounts Count,Account Size Ratio (%),Average Projected CLV ($),Average Churn Risk (%),Revenue Share Ratio\r\n";
    
    if (clustering && clustering.clusters.length > 0) {
      clustering.clusters.forEach((cls) => {
        const fallback = getFallbackSegmentInsight(cls.clusterId);
        const segmentName = insights?.segments.find(s => s.clusterId === cls.clusterId)?.name || fallback.name;
        const sizePct = Math.round((cls.customers.length / dataset.customers.length) * 100);
        const shareRatio = cls.revenueRatio ? Math.round(cls.revenueRatio * 100) : 25;
        csv += `Cohort #${cls.clusterId + 1},"${segmentName.replace(/"/g, '""')}",${cls.customers.length},${sizePct}%,${cls.averageClv || 0},${cls.churnRisk || 0}%,${shareRatio}%\r\n`;
      });
    }
    csv += "\r\n";

    // Section 2: Centroid Feature Coordinates
    if (clustering && clustering.clusters.length > 0) {
      csv += "SECTION 2 - COHORT CLUSTER INTERIOR CENTROIDS\r\n";
      const feats = dataset.features;
      csv += `Centroid Cluster ID,Cohort Profile Name,${feats.map(f => `"Centroid Average: ${f.replace(/"/g, '""')}"`).join(",")}\r\n`;
      
      clustering.clusters.forEach((cls) => {
        const fallback = getFallbackSegmentInsight(cls.clusterId);
        const segmentName = insights?.segments.find(s => s.clusterId === cls.clusterId)?.name || fallback.name;
        const featuresLine = feats.map(f => cls.centroid[f]?.toFixed(2) || "0.00").join(",");
        csv += `Cohort #${cls.clusterId + 1},"${segmentName.replace(/"/g, '""')}",${featuresLine}\r\n`;
      });
      csv += "\r\n";
    }

    // Section 3: All Customer Rows with assignments
    csv += "SECTION 3 - COMPREHENSIVE CUSTOMER MEMBER CLASSIFICATIONS\r\n";
    const allFeatures = dataset.features;
    csv += `CustomerID,AssignedCohortID,AssignedCohortProfileName,${allFeatures.map(f => `"${f.replace(/"/g, '""')}"`).join(",")},ProjectedValue,EngagementScore\r\n`;

    if (clustering && clustering.clusters.length > 0) {
      clustering.clusters.forEach((cls) => {
        const fallback = getFallbackSegmentInsight(cls.clusterId);
        const segmentName = insights?.segments.find(s => s.clusterId === cls.clusterId)?.name || fallback.name;
        
        cls.customers.forEach((cust) => {
          const featureValues = allFeatures.map(f => cust[f] !== undefined ? cust[f] : "").join(",");
          const projectedVal = cust.customerValueProjected || cls.averageClv || "";
          const engagementVal = cust.engagementScore || "";
          csv += `"${cust.id}",Cohort #${cls.clusterId + 1},"${segmentName.replace(/"/g, '""')}",${featureValues},${projectedVal},${engagementVal}\r\n`;
        });
      });
    }

    return csv;
  };

  // Compiler for copywriting playbooks in plain text
  const compilePlaybooks = (): string => {
    let txt = "";
    txt += "========================================================================\r\n";
    txt += `          AI COHORT OPERATIONAL COPY DECKS & CAMPAIGNS\r\n`;
    txt += `          Active Cohort Target: ${dataset.name.toUpperCase()}\r\n`;
    txt += `          Export Compiled On: ${new Date().toLocaleDateString()}\r\n`;
    txt += "========================================================================\r\n\r\n";

    if (clustering && clustering.clusters.length > 0) {
      clustering.clusters.forEach((cls, idx) => {
        const fallback = getFallbackSegmentInsight(cls.clusterId);
        const play = insights?.segments.find(s => s.clusterId === cls.clusterId) || fallback;

        txt += `========================================================================\r\n`;
        txt += ` COHORT CLUSTER #${idx + 1}: ${play.name.toUpperCase()}\r\n`;
        txt += `========================================================================\r\n`;
        txt += `📊 Cohort Volume: ${cls.customers.length} Accounts (${Math.round((cls.customers.length / dataset.customers.length) * 100)}% distribution)\r\n`;
        txt += `💎 Customer Lifetime Value: $${cls.averageClv || 0}\r\n`;
        txt += `⚡ Churn Risk Index: ${cls.churnRisk || 0}%\r\n`;
        txt += `📈 Target Segment Growth Trajectory: +${cls.growthRate || 10}%\r\n\r\n`;
        txt += `📝 Persona Profile Description:\r\n   ${play.personaDescription}\r\n\r\n`;
        
        txt += `🎯 Dominant Statistical Traits:\r\n`;
        play.dominantTraits.forEach((trait, i) => {
          txt += `   ${i + 1}. ${trait}\r\n`;
        });
        
        txt += `\r\n🚀 Strategic Directive Actions:\r\n`;
        play.marketingStrategies.forEach((strat, i) => {
          txt += `   ${i + 1}. ${strat}\r\n`;
        });

        txt += `\r\n✈️ Selected Delivery Channel: ${play.recommendedChannel}\r\n`;
        txt += `💳 Price Discount Sensitivity: ${play.discountSensitivity}\r\n`;
        txt += `💡 Launch-Ready Campaign Idea: ${play.campaignIdea}\r\n\r\n`;

        txt += `📬 EMAIL / IN-APP PUSH NEWSLETTER DIGITAL COPYWRITER DECK:\r\n`;
        txt += `   ------------------------------------------------------------------\r\n`;
        txt += `   Subject Line:\r\n   "${play.emailSubject}"\r\n\r\n`;
        txt += `   Body Template Draft:\r\n`;
        const lines = play.emailBody.split("\n");
        lines.forEach(l => {
          txt += `   ${l}\r\n`;
        });
        txt += `   ------------------------------------------------------------------\r\n\r\n\r\n`;
      });
    }

    return txt;
  };

  // Launch compilation with rich real data download pipelines
  const triggerCompilation = (type: string, filename: string) => {
    setDownloadType(type);
    setProgressBar(10);

    const interval = setInterval(() => {
      setProgressBar((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadType(null);
            setProgressBar(0);
            
            // Build real contents based on requested download type
            if (type === "pdf") {
              const doc = compilePDF();
              doc.save(filename);
            } else if (type === "excel") {
              const contents = compileCSV();
              const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else if (type === "playbooks") {
              const contents = compilePlaybooks();
              const blob = new Blob([contents], { type: "text/plain;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          }, 600);
          return 100;
        }
        return p + 30; // quick feedback loop
      });
    }, 150);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-slate-700">
      
      {/* LEFT: Configure Compilation Scope (Span 4) */}
      <section className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 tracking-tight text-sm">Report Scope Builder</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-slate-400 font-bold uppercase text-[10px]">Document Heading Title</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-sans font-semibold text-slate-800"
            />
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-50">
            <span className="block text-slate-400 font-bold uppercase text-[10px]">Include Chapters</span>
            
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeAI} 
                onChange={(e) => setIncludeAI(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer" 
              />
              <span className="font-medium text-slate-600">AI Role-Specific Strategic Playbooks</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeKPIs} 
                onChange={(e) => setIncludeKPIs(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer" 
              />
              <span className="font-medium text-slate-600">Executive Revenue KPI Summaries</span>
            </label>
          </div>

          <div className="bg-slate-50 hover:bg-slate-100/50 p-4 border border-slate-150 rounded-2xl flex gap-2 pt-3">
            <Printer className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <strong className="block text-slate-700">Pre-Compiled PDF Layout</strong>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Prints automatically to landscape format with correct page breaches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: Selected Compilation Previews and Download Blocks (Span 8) */}
      <main className="lg:col-span-8 space-y-6">
        
        {/* Export Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Export PDF Executive Summary */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5 text-xs">
              <div className="bg-rose-50 text-rose-600 p-1.5 rounded-lg w-fit"><FileText className="w-5 h-5" /></div>
              <strong className="block text-slate-800 font-bold leading-normal">Executive Intelligence PDF</strong>
              <p className="text-[11px] text-slate-400">Formal PDF advisory detailing clusters distributions and KPI outcomes.</p>
            </div>
            
            <button
              onClick={() => triggerCompilation("pdf", "Cohorts_AI_Executive_Report.pdf")}
              disabled={downloadType !== null}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-900 text-white font-bold text-xs transition hover:bg-slate-850 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {downloadType === "pdf" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {progressBar}%
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Compile PDF
                </>
              )}
            </button>
          </div>

          {/* Export Excel Cohort Matrix */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5 text-xs">
              <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg w-fit"><FileSpreadsheet className="w-5 h-5" /></div>
              <strong className="block text-slate-800 font-bold leading-normal">Operational Excel Matrix</strong>
              <p className="text-[11px] text-slate-400">Centroids mapping metrics formatted for analytical spreadsheet tools.</p>
            </div>

            <button
              onClick={() => triggerCompilation("excel", "Cohorts_AI_Centroids_Matrix.csv")}
              disabled={downloadType !== null}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-900 text-white font-bold text-xs transition hover:bg-slate-855 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {downloadType === "excel" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {progressBar}%
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Export Excel
                </>
              )}
            </button>
          </div>

          {/* Export Strategy Playbooks */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5 text-xs">
              <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg w-fit"><BookOpen className="w-5 h-5" /></div>
              <strong className="block text-slate-800 font-bold leading-normal">AI Strategy Playbooks</strong>
              <p className="text-[11px] text-slate-400">Marketing campaigns copy decks with email subjects and copywriter drafts.</p>
            </div>

            <button
              onClick={() => triggerCompilation("playbooks", "Cohorts_AI_Strategy_Playbooks.txt")}
              disabled={downloadType !== null}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-900 text-white font-bold text-xs transition hover:bg-slate-850 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {downloadType === "playbooks" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {progressBar}%
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Export Copy Decks
                </>
              )}
            </button>
          </div>

        </div>

        {/* Live Compilation Sheet Preview */}
        <div className="bg-white border border-slate-100/80 rounded-3xl p-6.5 shadow-sm space-y-6">
          <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-[11px] text-slate-500">
            <span>PREVIEW LAYOUT: Compiled Sheet Scope matching active parameters</span>
            <span className="font-bold flex items-center gap-1.5 text-emerald-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> Ready to file
            </span>
          </div>

          {/* Actual printed page mockup representation */}
          <div className="border border-slate-150 rounded-2xl p-8 bg-slate-50/25 max-w-2xl mx-auto space-y-6 font-sans select-none relative overflow-hidden bg-gradient-to-tr from-slate-50/50 via-white to-slate-50/20 text-slate-800 shadow-inner">
            {/* Top margin badge */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest block font-bold">COHORTS AI OFFICE DECK</span>
                <strong className="text-sm font-black text-slate-900">{customTitle}</strong>
              </div>
              <span className="text-[9px] text-slate-400 font-mono text-right font-bold">
                DATE: {new Date().toLocaleDateString()}<br />
                PAGES: 1 OF 3
              </span>
            </div>

            {/* Document Content Block */}
            <div className="space-y-4 text-xs font-sans leading-relaxed">
              <div>
                <strong className="text-[10px] text-indigo-700 uppercase block font-bold tracking-wider mb-0.5">I. Objective</strong>
                <p className="text-slate-500 font-medium leading-snug">
                  Advisory report commissioned for dataset <span className="text-slate-850 font-bold underline font-mono">{dataset.name}</span> comprising a core count of <span className="font-bold text-slate-850 font-mono">{dataset.customers.length} processed accounts</span> partitioned into {clustering?.k || 4} optimized segments using K-Means distance calculations.
                </p>
              </div>

              {includeKPIs && (
                <div>
                  <strong className="text-[10px] text-indigo-700 uppercase block font-bold tracking-wider mb-1">II. Corporate Centroids Analysis</strong>
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    {clustering?.clusters?.slice(0,2).map((cls, idx) => (
                      <div key={idx} className="border border-slate-100 bg-white p-3 rounded-xl shadow-sm text-[11px] leading-relaxed">
                        <strong className="text-slate-850 block font-bold">Segment {idx + 1}: avg CLV: ${cls.averageClv}</strong>
                        <span className="text-slate-400 font-mono text-[10px] block">Includes {cls.customers.length} accounts ({Math.round(cls.revenueRatio ? cls.revenueRatio * 100 : 25)}% revenue contribution)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {includeAI && (
                <div>
                  <strong className="text-[10px] text-indigo-700 uppercase block font-bold tracking-wider mb-2">III. Strategic Directives Summary</strong>
                  <div className="border border-dashed border-slate-150 p-3 bg-slate-50/50 rounded-xl leading-relaxed text-[10px] text-slate-600 font-mono">
                    PROMPT DIRECTION SUMMARY: Establish high-touch onboarding audits with maximum frequency startup accounts to lock-in long term renewals. Enable premium lookalike marketing activations to expand ad caps.
                  </div>
                </div>
              )}
            </div>

            {/* Print Footer */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Verified Commercial Output Seal</span>
              <span>Cohorts AI Platform © 2026</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
