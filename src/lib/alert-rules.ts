export interface RuleEvaluationContext {
  centreId: string;
  centreName: string;
  batchId?: string;
  batchName?: string;
  attendancePercentage?: number;
  trainerPresentToday?: boolean;
  trainerLateMinutes?: number;
  attendanceMarkedToday?: boolean;
  complianceScore?: number;
  daysSinceLastInspection?: number;
}

export interface GeneratedAlert {
  ruleType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  centreId: string;
  batchId?: string;
}

/**
 * Rule Engine evaluating operational compliance metrics
 */
export function evaluateComplianceRules(ctx: RuleEvaluationContext): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];

  // 1. Low Student Attendance (<75%)
  if (ctx.attendancePercentage !== undefined && ctx.attendancePercentage < 75) {
    const isCritical = ctx.attendancePercentage < 50;
    alerts.push({
      ruleType: "LOW_STUDENT_ATTENDANCE",
      severity: isCritical ? "CRITICAL" : "HIGH",
      title: `Low Batch Attendance (${ctx.attendancePercentage}%)`,
      description: `Batch ${ctx.batchName || "N/A"} at ${ctx.centreName} has attendance of only ${ctx.attendancePercentage}%, below the required 75% threshold.`,
      centreId: ctx.centreId,
      batchId: ctx.batchId,
    });
  }

  // 2. Trainer Absence
  if (ctx.trainerPresentToday === false) {
    alerts.push({
      ruleType: "TRAINER_ABSENT",
      severity: "CRITICAL",
      title: "Trainer Absent Without Prior Leave",
      description: `Trainer for scheduled batches at ${ctx.centreName} has not checked in today. Immediate substitute or verification required.`,
      centreId: ctx.centreId,
      batchId: ctx.batchId,
    });
  }

  // 3. Repeated Late Arrival (>30 mins)
  if (ctx.trainerLateMinutes !== undefined && ctx.trainerLateMinutes > 30) {
    alerts.push({
      ruleType: "TRAINER_LATE",
      severity: "MEDIUM",
      title: `Trainer Late Arrival (${ctx.trainerLateMinutes}m)`,
      description: `Trainer arrived ${ctx.trainerLateMinutes} minutes past scheduled session start at ${ctx.centreName}.`,
      centreId: ctx.centreId,
      batchId: ctx.batchId,
    });
  }

  // 4. Attendance Not Marked For The Day
  if (ctx.attendanceMarkedToday === false) {
    alerts.push({
      ruleType: "UNMARKED_ATTENDANCE",
      severity: "HIGH",
      title: "Attendance Not Marked for Today's Batch",
      description: `Daily attendance for batch ${ctx.batchName || "N/A"} has not been submitted. Reminders sent to trainer and centre manager.`,
      centreId: ctx.centreId,
      batchId: ctx.batchId,
    });
  }

  // 5. Infrastructure Compliance Below Threshold (<70%)
  if (ctx.complianceScore !== undefined && ctx.complianceScore < 70) {
    const isCritical = ctx.complianceScore < 50;
    alerts.push({
      ruleType: "LOW_COMPLIANCE_SCORE",
      severity: isCritical ? "CRITICAL" : "HIGH",
      title: `Substandard Infrastructure Score (${ctx.complianceScore}%)`,
      description: `${ctx.centreName} scored ${ctx.complianceScore}% on the latest inspection. Urgent corrective action required.`,
      centreId: ctx.centreId,
    });
  }

  // 6. Overdue Inspection (>30 days)
  if (ctx.daysSinceLastInspection !== undefined && ctx.daysSinceLastInspection > 30) {
    alerts.push({
      ruleType: "CHECKLIST_OVERDUE",
      severity: "MEDIUM",
      title: `Monthly Inspection Overdue (${ctx.daysSinceLastInspection} days)`,
      description: `No inspection has been recorded for ${ctx.centreName} in the last ${ctx.daysSinceLastInspection} days.`,
      centreId: ctx.centreId,
    });
  }

  return alerts;
}

/**
 * Checks if an open alert has exceeded 48 hours and needs escalation to District Officer
 */
export function checkEscalationStatus(
  alertCreatedAt: Date,
  status: string
): { shouldEscalate: boolean; hoursElapsed: number } {
  if (status !== "OPEN") {
    return { shouldEscalate: false, hoursElapsed: 0 };
  }

  const now = new Date();
  const diffMs = now.getTime() - new Date(alertCreatedAt).getTime();
  const hoursElapsed = Math.floor(diffMs / (1000 * 60 * 60));

  return {
    shouldEscalate: hoursElapsed >= 48,
    hoursElapsed,
  };
}
