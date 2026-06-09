export interface Customer {
  id: string;
  [key: string]: string | number; // Support arbitrary age, income, spending, etc.
  // Add prediction & projection fields for advanced intelligence workspace
  pcaX?: number;
  pcaY?: number;
  tsneX?: number;
  tsneY?: number;
  umapX?: number;
  umapY?: number;
  predictedChurnRisk?: number; // 0 to 1
  customerValueProjected?: number; // projected CLV
  engagementScore?: number; // 0 to 100
}

export interface Dataset {
  id: string;
  name: string;
  vertical: string;
  customers: Customer[];
  features: string[]; // List of numeric features we can run clustering on
  featureUnits: Record<string, string>; // Units, e.g. "Age" -> "years", "Income" -> "k USD/yr"
}

export interface ClusterStats {
  avg: number;
  min: number;
  max: number;
  sum: number;
}

export interface Cluster {
  clusterId: number;
  name: string;
  centroid: Record<string, number>;
  customers: Customer[];
  color: string;
  stats: Record<string, ClusterStats>;
  // Additional business properties
  revenueRatio?: number; // e.g. 0.42 (42%)
  averageClv?: number;
  revenueContribution?: number;
  growthRate?: number; // e.g. 18 (+18%)
  churnRisk?: number; // e.g. 24 (24% risk)
}

export interface ClusteringResult {
  k: number;
  clusters: Cluster[];
  wcss: number; // Within-Cluster Sum of Squares for the elbow calculation
  iterations: number;
  // Advanced metrics for data science lab
  silhouetteScore: number;
  daviesBouldinIndex: number;
  calinskiHarabaszScore: number;
}

export interface ElbowPoint {
  k: number;
  wcss: number;
}

export interface AiSegment {
  clusterId: number;
  name: string;
  personaDescription: string;
  dominantTraits: string[];
  marketingStrategies: string[];
  recommendedChannel: string;
  discountSensitivity: string;
  campaignIdea: string;
  emailSubject: string;
  emailBody: string;
  // Additional enriched AI aspects
  roleSpecificInsights?: {
    businessAnalyst: string;
    marketingStrategist: string;
    revenueConsultant: string;
    retentionAdvisor: string;
  };
}

export interface AiInsightsResponse {
  overallAnalysis: string;
  segments: AiSegment[];
}

export type ActivePage = "executive" | "lab" | "intelligence" | "predictions" | "reporting";
