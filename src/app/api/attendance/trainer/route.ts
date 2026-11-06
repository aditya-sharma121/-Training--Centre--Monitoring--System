import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isWithinGeofence } from "@/lib/geofence";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      trainerId,
      action = "CHECK_IN", // "CHECK_IN" or "CHECK_OUT"
      latitude,
      longitude,
      selfieUrl,
      notes,
    } = body;

    if (!trainerId) {
      return NextResponse.json({ success: false, error: "Trainer ID is required" }, { status: 400 });
    }

    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
      include: { centre: true },
    });

    if (!trainer) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 });
    }

    // Geofence check
    let isGeoValid = true;
    let distanceMeters = 0;
    if (latitude && longitude && trainer.centre.latitude && trainer.centre.longitude) {
      const geo = isWithinGeofence(
        latitude,
        longitude,
        trainer.centre.latitude,
        trainer.centre.longitude,
        trainer.centre.geoRadiusMeters || 250
      );
      isGeoValid = geo.valid;
      distanceMeters = geo.distanceMeters;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const now = new Date();

    // Find or create today's record
    let record = await prisma.trainerAttendance.findUnique({
      where: {
        trainerId_date: {
          trainerId: trainer.id,
          date: todayDate,
        },
      },
    });

    if (action === "CHECK_IN") {
      // Calculate late minutes (official start time is 09:00 AM)
      const scheduledStart = new Date(todayDate);
      scheduledStart.setHours(9, 0, 0, 0);
      const lateMs = now.getTime() - scheduledStart.getTime();
      const lateMinutes = lateMs > 0 ? Math.floor(lateMs / (1000 * 60)) : 0;

      if (!record) {
        record = await prisma.trainerAttendance.create({
          data: {
            trainerId: trainer.id,
            centreId: trainer.centreId,
            date: todayDate,
            checkInTime: now,
            checkInLat: latitude ? parseFloat(latitude) : null,
            checkInLng: longitude ? parseFloat(longitude) : null,
            isCheckInGeoValid: isGeoValid,
            checkInSelfieUrl: selfieUrl || null,
            status: lateMinutes > 15 ? "LATE" : "PRESENT",
            lateMinutes,
            notes: notes || null,
          },
        });
      } else {
        record = await prisma.trainerAttendance.update({
          where: { id: record.id },
          data: {
            checkInTime: now,
            checkInLat: latitude ? parseFloat(latitude) : record.checkInLat,
            checkInLng: longitude ? parseFloat(longitude) : record.checkInLng,
            isCheckInGeoValid: isGeoValid,
            checkInSelfieUrl: selfieUrl || record.checkInSelfieUrl,
            lateMinutes,
            notes: notes || record.notes,
          },
        });
      }
    } else {
      // CHECK_OUT
      if (!record) {
        return NextResponse.json({ success: false, error: "No check-in record found for today to check out from." }, { status: 400 });
      }

      record = await prisma.trainerAttendance.update({
        where: { id: record.id },
        data: {
          checkOutTime: now,
          checkOutLat: latitude ? parseFloat(latitude) : null,
          checkOutLng: longitude ? parseFloat(longitude) : null,
          isCheckOutGeoValid: isGeoValid,
        },
      });
    }

    return NextResponse.json({
      success: true,
      action,
      isGeoValid,
      distanceMeters,
      record,
    });
  } catch (error: any) {
    console.error("POST /api/attendance/trainer error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
