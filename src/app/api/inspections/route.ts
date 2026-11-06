import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateComplianceScore } from "@/lib/compliance";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const centreId = searchParams.get("centreId");

    const checklistItems = await prisma.checklistItem.findMany();

    const where: any = {};
    if (centreId) where.centreId = centreId;

    const inspections = await prisma.inspection.findMany({
      where,
      include: {
        centre: { select: { name: true, code: true, district: true, state: true } },
        inspector: { select: { name: true, role: true } },
        responses: { include: { checklistItem: true } },
        evidences: true,
      },
      orderBy: { conductedDate: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, checklistItems, inspections });
  } catch (error: any) {
    console.error("GET /api/inspections error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      centreId,
      inspectorId,
      type = "OFFICER_VERIFICATION",
      responses, // Array of { checklistItemId: string, status: "COMPLIANT"|"PARTIALLY_COMPLIANT"|"NON_COMPLIANT", remarks?: string }
      remarks,
      evidencePhotos = [], // Array of { photoUrl, checklistItemId, itemTag, lat, lng }
    } = body;

    if (!centreId || !inspectorId || !responses || !Array.isArray(responses)) {
      return NextResponse.json({ success: false, error: "Missing required inspection data" }, { status: 400 });
    }

    const allItems = await prisma.checklistItem.findMany();
    const itemsMap = new Map(allItems.map((i) => [i.id, i]));

    // Format for calculation
    const calcInputs = responses.map((r: any) => {
      const def = itemsMap.get(r.checklistItemId);
      return {
        checklistItemId: r.checklistItemId,
        category: def?.category || "General",
        weight: def?.weight || 1.0,
        maxScore: def?.maxScore || 10.0,
        status: r.status,
      };
    });

    const scoreResult = calculateComplianceScore(calcInputs);

    // Create Inspection record
    const inspection = await prisma.inspection.create({
      data: {
        centreId,
        inspectorId,
        type,
        status: "SUBMITTED",
        conductedDate: new Date(),
        totalScore: scoreResult.totalScore,
        complianceGrade: scoreResult.grade,
        remarks: remarks || `Inspection conducted. Total Compliance Score: ${scoreResult.totalScore}% (${scoreResult.grade}).`,
      },
    });

    // Create individual responses
    for (const r of responses) {
      const def = itemsMap.get(r.checklistItemId);
      const scoreAwarded =
        r.status === "COMPLIANT"
          ? def?.maxScore || 10
          : r.status === "PARTIALLY_COMPLIANT"
          ? (def?.maxScore || 10) * 0.5
          : 0;

      const createdResp = await prisma.inspectionResponse.create({
        data: {
          inspectionId: inspection.id,
          checklistItemId: r.checklistItemId,
          status: r.status,
          scoreAwarded,
          remarks: r.remarks || null,
        },
      });

      // Attach evidence if provided for this item
      const matchingEvidence = evidencePhotos.filter((e: any) => e.checklistItemId === r.checklistItemId);
      for (const ev of matchingEvidence) {
        await prisma.evidence.create({
          data: {
            inspectionId: inspection.id,
            inspectionResponseId: createdResp.id,
            photoUrl: ev.photoUrl,
            latitude: ev.lat || null,
            longitude: ev.lng || null,
            itemTag: ev.itemTag || null,
            verifiedByAi: true,
          },
        });
      }
    }

    // Update the centre's official compliance score
    await prisma.centre.update({
      where: { id: centreId },
      data: {
        complianceScore: scoreResult.totalScore,
        complianceGrade: scoreResult.grade,
      },
    });

    // Check if score is substandard (<70%) and trigger alert
    if (scoreResult.totalScore < 70) {
      await prisma.alert.create({
        data: {
          centreId,
          ruleType: "LOW_COMPLIANCE_SCORE",
          severity: scoreResult.totalScore < 50 ? "CRITICAL" : "HIGH",
          title: `Inspection Non-Compliance (${scoreResult.totalScore}%)`,
          description: `Latest inspection score of ${scoreResult.totalScore}% falls below required 70% benchmark. Immediate remediation notice dispatched.`,
          status: "OPEN",
        },
      });
    }

    return NextResponse.json({
      success: true,
      inspectionId: inspection.id,
      scoreResult,
    });
  } catch (error: any) {
    console.error("POST /api/inspections error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
