import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkEscalationStatus } from "@/lib/alert-rules";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const centreId = searchParams.get("centreId");
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");

    const where: any = {};
    if (centreId) where.centreId = centreId;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        centre: { select: { id: true, name: true, code: true, district: true, state: true } },
        batch: { select: { id: true, name: true, code: true } },
        resolvedByUser: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Check 48h escalation for open alerts
    const processedAlerts = [];
    for (const a of alerts) {
      if (a.status === "OPEN") {
        const esc = checkEscalationStatus(a.createdAt, a.status);
        if (esc.shouldEscalate) {
          const updated = await prisma.alert.update({
            where: { id: a.id },
            data: { status: "ESCALATED", escalatedAt: new Date() },
            include: { centre: true, batch: true, resolvedByUser: true },
          });
          processedAlerts.push(updated);
          continue;
        }
      }
      processedAlerts.push(a);
    }

    return NextResponse.json({ success: true, count: processedAlerts.length, alerts: processedAlerts });
  } catch (error: any) {
    console.error("GET /api/alerts error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId, status, resolutionNotes, resolvedByUserId } = body;

    if (!alertId || !status) {
      return NextResponse.json({ success: false, error: "Missing alertId or status" }, { status: 400 });
    }

    const updated = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status,
        resolutionNotes: resolutionNotes || null,
        resolvedByUserId: status === "RESOLVED" ? resolvedByUserId : null,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, alert: updated });
  } catch (error: any) {
    console.error("PATCH /api/alerts error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
