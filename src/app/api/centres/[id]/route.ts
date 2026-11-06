import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const centre = await prisma.centre.findUnique({
      where: { id },
      include: {
        trainers: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        batches: {
          include: {
            course: true,
            _count: { select: { students: true } },
          },
        },
        students: {
          take: 50,
          include: {
            batch: { select: { name: true, code: true } },
          },
        },
        inspections: {
          orderBy: { conductedDate: "desc" },
          take: 5,
          include: {
            inspector: { select: { name: true, role: true } },
            responses: {
              include: { checklistItem: true },
            },
            evidences: true,
          },
        },
        alerts: {
          where: { status: "OPEN" },
          orderBy: { createdAt: "desc" },
        },
        trainerAttendance: {
          take: 30,
          orderBy: { date: "desc" },
          include: {
            trainer: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!centre) {
      return NextResponse.json({ success: false, error: "Centre not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, centre });
  } catch (error: any) {
    console.error("GET /api/centres/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
