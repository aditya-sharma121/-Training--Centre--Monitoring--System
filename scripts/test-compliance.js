// Unit test for compliance score calculation and alert rules
const assert = require("assert");

function calculateComplianceScore(items, mandatoryItemIds = []) {
  if (!items || items.length === 0) {
    return { totalScore: 0, grade: "CRITICAL", mandatoryPassed: false };
  }

  let totalWeightedEarned = 0;
  let totalWeightedPossible = 0;
  let mandatoryPassed = true;

  for (const item of items) {
    let multiplier = 0;
    if (item.status === "COMPLIANT") multiplier = 1.0;
    else if (item.status === "PARTIALLY_COMPLIANT") multiplier = 0.5;
    else {
      multiplier = 0.0;
      if (mandatoryItemIds.includes(item.checklistItemId)) {
        mandatoryPassed = false;
      }
    }

    const earned = item.maxScore * multiplier * item.weight;
    const possible = item.maxScore * item.weight;

    totalWeightedEarned += earned;
    totalWeightedPossible += possible;
  }

  const rawScore = totalWeightedPossible > 0 ? (totalWeightedEarned / totalWeightedPossible) * 100 : 0;
  const totalScore = Math.round(rawScore * 10) / 10;

  let grade = "CRITICAL";
  if (totalScore >= 90) grade = "EXCELLENT";
  else if (totalScore >= 75) grade = "COMPLIANT";
  else if (totalScore >= 50) grade = "PARTIAL";

  return { totalScore, grade, mandatoryPassed };
}

function evaluateRules(ctx) {
  const alerts = [];
  if (ctx.attendancePercentage !== undefined && ctx.attendancePercentage < 75) {
    alerts.push({
      ruleType: "LOW_STUDENT_ATTENDANCE",
      severity: ctx.attendancePercentage < 50 ? "CRITICAL" : "HIGH",
    });
  }
  if (ctx.trainerPresentToday === false) {
    alerts.push({ ruleType: "TRAINER_ABSENT", severity: "CRITICAL" });
  }
  if (ctx.complianceScore !== undefined && ctx.complianceScore < 70) {
    alerts.push({
      ruleType: "LOW_COMPLIANCE_SCORE",
      severity: ctx.complianceScore < 50 ? "CRITICAL" : "HIGH",
    });
  }
  return alerts;
}

console.log("--- Running Unit Tests ---");

// Test 1: Full Compliance
const fullItems = [
  { checklistItemId: "1", category: "Classroom", weight: 1.0, maxScore: 10, status: "COMPLIANT" },
  { checklistItemId: "2", category: "IT Lab", weight: 1.5, maxScore: 10, status: "COMPLIANT" },
];
const res1 = calculateComplianceScore(fullItems);
assert.strictEqual(res1.totalScore, 100, "Full score should be 100%");
assert.strictEqual(res1.grade, "EXCELLENT");
console.log("✔ Test 1 Passed: 100% Full Compliance -> EXCELLENT");

// Test 2: Partial Compliance
const partialItems = [
  { checklistItemId: "1", category: "Classroom", weight: 1.0, maxScore: 10, status: "PARTIALLY_COMPLIANT" }, // 5 * 1 = 5
  { checklistItemId: "2", category: "Fire Safety", weight: 1.5, maxScore: 10, status: "NON_COMPLIANT" },      // 0 * 1.5 = 0
];
const res2 = calculateComplianceScore(partialItems, ["2"]);
assert.strictEqual(res2.mandatoryPassed, false, "Mandatory item failing should flag mandatoryPassed = false");
assert.strictEqual(res2.grade, "CRITICAL");
console.log("✔ Test 2 Passed: Mandatory check fail flags correctly");

// Test 3: Alert Engine Rule Check
const alertResults = evaluateRules({
  attendancePercentage: 45, // <50% should be CRITICAL
  trainerPresentToday: false,
  complianceScore: 48,
});
assert.strictEqual(alertResults.length, 3, "Expected 3 alerts");
assert.strictEqual(alertResults[0].severity, "CRITICAL");
assert.strictEqual(alertResults[1].ruleType, "TRAINER_ABSENT");
assert.strictEqual(alertResults[2].ruleType, "LOW_COMPLIANCE_SCORE");
console.log("✔ Test 3 Passed: Alert rules correctly identify critical violations");

console.log("\nALL UNIT TESTS PASSED SUCCESSFULLY! (3/3)");
