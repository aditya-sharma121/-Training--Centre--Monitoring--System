import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isWithinGeofence } from "@/lib/geofence";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      batchId,
      date,
      records, // Array of { studentId: string, status: "PRESENT"|"ABSENT"|"LATE"|"LEAVE" }
      markedByUserId,
      verificationMethod = "MANUAL",
      latitude,
      longitude,
    } = body;

    if (!batchId || !records || !Array.isArray(records)) {
      return NextResponse.json({ success: false, error: "Invalid attendance payload" }, { status: 400 });
    }

    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { centre: true },
    });

    if (!batch) {
      return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 });
    }

    // Geofence verification check
    let isGeoValid = true;
    let distanceMeters = 0;
    if (latitude && longitude && batch.centre.latitude && batch.centre.longitude) {
      const geoCheck = isWithinGeofence(
        latitude,
        longitude,
        batch.centre.latitude,
        batch.centre.longitude,
        batch.centre.geoRadiusMeters || 250
      );
      isGeoValid = geoCheck.valid;
      distanceMeters = geoCheck.distanceMeters;
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(9, 0, 0, 0);

    const now = new Date();
    const updatedRecords = [];

    for (const item of records) {
      // Check if existing record is locked (>24 hours)
      const existing = await prisma.studentAttendance.findUnique({
        where: {
          studentId_date: {
            studentId: item.studentId,
            date: targetDate,
          },
        },
      });

      if (existing) {
        const hoursOld = (now.getTime() - new Date(existing.createdAt).getTime()) / (1000 * 60 * 60);
        if (existing.editLocked || hoursOld > 24) {
          return NextResponse.json(
            {
              success: false,
              error: `Edit locked: Attendance for ${targetDate.toISOString().split("T")[0]} cannot be edited after 24 hours.`,
            },
            { status: 403 }
          );
        }

        // Log audit trail
        await prisma.auditLog.create({
          data: {
            userId: markedByUserId || null,
            action: "ATTENDANCE_EDIT",
            entityType: "StudentAttendance",
            entityId: existing.id,
            oldValues: JSON.stringify({ status: existing.status }),
            newValues: JSON.stringify({ status: item.status }),
          },
        });

        const updated = await prisma.studentAttendance.update({
          where: { id: existing.id },
          data: {
            status: item.status,
            verificationMethod,
            geoLatitude: latitude ? parseFloat(latitude) : existing.geoLatitude,
            geoLongitude: longitude ? parseFloat(longitude) : existing.geoLongitude,
            isGeoValid,
            updatedAt: now,
          },
        });
        updatedRecords.push(updated);
      } else {
        const created = await prisma.studentAttendance.create({
          data: {
            studentId: item.studentId,
            batchId,
            date: targetDate,
            status: item.status,
            markedByUserId: markedByUserId || "system",
            verificationMethod,
            geoLatitude: latitude ? parseFloat(latitude) : null,
            geoLongitude: longitude ? parseFloat(longitude) : null,
            isGeoValid,
          },
        });
        updatedRecords.push(created);
      }
    }

    return NextResponse.json({
      success: true,
      count: updatedRecords.length,
      isGeoValid,
      distanceMeters,
      records: updatedRecords,
    });
  } catch (error: any) {
    console.error("POST /api/attendance/student error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
