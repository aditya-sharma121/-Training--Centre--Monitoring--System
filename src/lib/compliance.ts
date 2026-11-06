export interface ChecklistResponseInput {
  checklistItemId: string;
  category: string;
  weight: number;
  maxScore: number;
  status: "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NON_COMPLIANT";
  remarks?: string;
}

export type ComplianceGrade = "EXCELLENT" | "COMPLIANT" | "PARTIAL" | "CRITICAL";

export interface ComplianceScoreResult {
  totalScore: number; // 0 to 100
  grade: ComplianceGrade;
  categoryScores: Record<
    string,
    {
      earned: number;
      total: number;
      percentage: number;
    }
  >;
  mandatoryPassed: boolean;
}

/**
 * Calculates weighted compliance score (0-100) from checklist responses.
 * Status weights:
 * - COMPLIANT = 100% of item maxScore
 * - PARTIALLY_COMPLIANT = 50% of item maxScore
 * - NON_COMPLIANT = 0%
 */
export function calculateComplianceScore(
  items: ChecklistResponseInput[],
  mandatoryItemIds: string[] = []
): ComplianceScoreResult {
  if (!items || items.length === 0) {
    return {
      totalScore: 0,
      grade: "CRITICAL",
      categoryScores: {},
      mandatoryPassed: false,
    };
  }

  let totalWeightedEarned = 0;
  let totalWeightedPossible = 0;
  let mandatoryPassed = true;

  const categoryScores: Record<string, { earned: number; total: number; percentage: number }> = {};

  for (const item of items) {
    let multiplier = 0;
    if (item.status === "COMPLIANT") {
      multiplier = 1.0;
    } else if (item.status === "PARTIALLY_COMPLIANT") {
      multiplier = 0.5;
    } else {
      multiplier = 0.0;
      if (mandatoryItemIds.includes(item.checklistItemId)) {
        mandatoryPassed = false;
      }
    }

    const earned = item.maxScore * multiplier * item.weight;
    const possible = item.maxScore * item.weight;

    totalWeightedEarned += earned;
    totalWeightedPossible += possible;

    if (!categoryScores[item.category]) {
      categoryScores[item.category] = { earned: 0, total: 0, percentage: 0 };
    }
    categoryScores[item.category].earned += earned;
    categoryScores[item.category].total += possible;
  }

  // Calculate percentages per category
  for (const cat in categoryScores) {
    const { earned, total } = categoryScores[cat];
    categoryScores[cat].percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
  }

  const rawScore = totalWeightedPossible > 0 ? (totalWeightedEarned / totalWeightedPossible) * 100 : 0;
  const totalScore = Math.round(rawScore * 10) / 10;

  let grade: ComplianceGrade = "CRITICAL";
  if (totalScore >= 90) {
    grade = "EXCELLENT";
  } else if (totalScore >= 75) {
    grade = "COMPLIANT";
  } else if (totalScore >= 50) {
    grade = "PARTIAL";
  } else {
    grade = "CRITICAL";
  }

  return {
    totalScore,
    grade,
    categoryScores,
    mandatoryPassed,
  };
}

export const CHECKLIST_CATEGORIES = [
  { name: "Classrooms", weight: 1.2, description: "Adequate seating, lighting, ventilation, projector/blackboard" },
  { name: "IT Lab & Computers", weight: 1.5, description: "1:1 computer ratio, working peripherals, licensed software" },
  { name: "Power Backup", weight: 1.2, description: "UPS / Inverter / Diesel Generator with >=2 hrs capacity" },
  { name: "Drinking Water", weight: 1.0, description: "Hygienic RO/purified drinking water dispenser" },
  { name: "Sanitation & Toilets", weight: 1.2, description: "Separate clean toilets for male, female, and PwD" },
  { name: "Fire Safety", weight: 1.5, description: "Valid fire extinguishers, smoke alarms, emergency exits" },
  { name: "Internet Connectivity", weight: 1.0, description: "Broadband connection >= 50 Mbps with Wi-Fi" },
  { name: "CCTV Surveillance", weight: 1.2, description: "Functional IP cameras covering entrance, labs, classrooms" },
  { name: "Safety & Emergency Signage", weight: 0.8, description: "Evacuation map, helpline numbers, caution signs" },
  { name: "Library & Study Materials", weight: 0.8, description: "Course handbooks, trade manuals, digital library" },
  { name: "Accessibility (Ramp/Lift)", weight: 1.0, description: "Wheelchair accessible ramp or ground floor entrance" },
  { name: "Overall Cleanliness & Hygiene", weight: 1.0, description: "Dust-free premises, daily cleaning roster, waste bins" }
];
