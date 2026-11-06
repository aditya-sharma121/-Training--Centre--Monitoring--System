import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = { deletedAt: null };
    if (state) where.state = state;
    if (district) where.district = district;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { district: { contains: search } },
      ];
    }

    const centres = await prisma.centre.findMany({
      where,
      include: {
        _count: {
          select: {
            batches: true,
            trainers: true,
            students: true,
            alerts: { where: { status: "OPEN" } },
          },
        },
      },
      orderBy: { complianceScore: "desc" },
    });

    return NextResponse.json({ success: true, count: centres.length, centres });
  } catch (error: any) {
    console.error("GET /api/centres error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, address, district, state, pincode, latitude, longitude, capacity, contactEmail, contactPhone, affiliationNumber } = body;

    if (!name || !code || !latitude || !longitude) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const centre = await prisma.centre.create({
      data: {
        name,
        code,
        address: address || "",
        district: district || "",
        state: state || "",
        pincode: pincode || "",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        capacity: parseInt(capacity) || 100,
        contactEmail: contactEmail || "",
        contactPhone: contactPhone || "",
        affiliationNumber: affiliationNumber || null,
        complianceScore: 85.0,
        complianceGrade: "COMPLIANT",
      },
    });

    return NextResponse.json({ success: true, centre }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/centres error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
