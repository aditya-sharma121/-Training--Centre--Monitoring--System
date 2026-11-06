import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper to generate dates relative to today
const today = new Date();
function daysAgo(days: number): Date {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  d.setHours(9, 0, 0, 0);
  return d;
}

const statesDistricts = [
  { state: "Rajasthan", district: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { state: "Rajasthan", district: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { state: "Rajasthan", district: "Udaipur", lat: 24.5854, lng: 73.7125 },
  { state: "Rajasthan", district: "Kota", lat: 25.2138, lng: 75.8648 },
  { state: "Rajasthan", district: "Ajmer", lat: 26.4499, lng: 74.6399 },
  { state: "Maharashtra", district: "Pune", lat: 18.5204, lng: 73.8567 },
  { state: "Maharashtra", district: "Mumbai Suburban", lat: 19.076, lng: 72.8777 },
  { state: "Maharashtra", district: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { state: "Maharashtra", district: "Nashik", lat: 19.9975, lng: 73.7898 },
  { state: "Maharashtra", district: "Aurangabad", lat: 19.8762, lng: 75.3433 },
  { state: "Uttar Pradesh", district: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { state: "Uttar Pradesh", district: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { state: "Uttar Pradesh", district: "Kanpur Nagar", lat: 26.4499, lng: 80.3319 },
  { state: "Uttar Pradesh", district: "Noida", lat: 28.5355, lng: 77.391 },
  { state: "Uttar Pradesh", district: "Prayagraj", lat: 25.4358, lng: 81.8463 },
  { state: "Karnataka", district: "Bengaluru Urban", lat: 12.9716, lng: 77.5946 },
  { state: "Karnataka", district: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { state: "Karnataka", district: "Hubballi", lat: 15.3647, lng: 75.124 },
  { state: "Karnataka", district: "Mangaluru", lat: 12.9141, lng: 74.856 },
  { state: "Karnataka", district: "Belagavi", lat: 15.8497, lng: 74.4977 },
  { state: "Madhya Pradesh", district: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { state: "Madhya Pradesh", district: "Indore", lat: 22.7196, lng: 75.8577 },
  { state: "Madhya Pradesh", district: "Gwalior", lat: 26.2183, lng: 78.1828 },
  { state: "Madhya Pradesh", district: "Jabalpur", lat: 23.1815, lng: 79.9864 },
  { state: "Madhya Pradesh", district: "Ujjain", lat: 23.1765, lng: 75.7885 },
];

const courseDefs = [
  { code: "CRS-SOLAR-01", name: "Solar PV Installer & Technician", sector: "Renewable Energy", durationMonths: 3 },
  { code: "CRS-EV-02", name: "Electric Vehicle Service Associate", sector: "Automotive", durationMonths: 4 },
  { code: "CRS-IT-03", name: "Full Stack Web & Cloud Development", sector: "IT-ITeS", durationMonths: 6 },
  { code: "CRS-HEALTH-04", name: "Healthcare General Duty Assistant (GDA)", sector: "Healthcare", durationMonths: 4 },
  { code: "CRS-CNC-05", name: "CNC Milling & Lathe Operator", sector: "Capital Goods", durationMonths: 3 },
  { code: "CRS-DATA-06", name: "Data Entry & Office Management", sector: "Management & IT", durationMonths: 2 },
];

const checklistCategories = [
  { category: "Classrooms", title: "Classroom Ergonomics & Ventilation", description: "Adequate desks, benches, natural ventilation, working ceiling fans and LED lighting for at least 30 students per room.", weight: 1.2, maxScore: 10 },
  { category: "IT Lab & Computers", title: "Computer Lab 1:1 Terminal Ratio", description: "Minimum 25 working desktop computers with Intel i5 or equivalent, 8GB RAM, licensed OS and requisite training software.", weight: 1.5, maxScore: 10 },
  { category: "Power Backup", title: "Dedicated Power Backup & UPS", description: "Online UPS capable of supporting IT lab for 30 minutes and DG/Inverter set for 3 hours of continuous operation.", weight: 1.2, maxScore: 10 },
  { category: "Drinking Water", title: "Hygienic RO Purified Water Facility", description: "Functional commercial RO water dispenser with periodic TDS testing and hygienic disposal cups/bottles.", weight: 1.0, maxScore: 10 },
  { category: "Sanitation & Toilets", title: "Separate Gender & PwD Toilets", description: "Clean, running water supply, liquid soap, functional flushing, separate doors for Male, Female, and PwD accessible washroom.", weight: 1.2, maxScore: 10 },
  { category: "Fire Safety", title: "Fire Safety Equipment & Inspection", description: "ISI marked ABC/CO2 extinguishers inspected within 6 months, clear evacuation map, unblocked emergency exits.", weight: 1.5, maxScore: 10 },
  { category: "Internet Connectivity", title: "High-Speed Broadband Connection", description: "Dedicated optical fiber broadband with minimum 50 Mbps speed test verification and Wi-Fi coverage.", weight: 1.0, maxScore: 10 },
  { category: "CCTV Surveillance", title: "24x7 IP CCTV Cameras with Recording", description: "Functional cameras covering entrance gate, biometric zone, computer lab, and classroom with >=30 days backup.", weight: 1.2, maxScore: 10 },
  { category: "Safety & Emergency Signage", title: "Emergency Signboards & Helpline Numbers", description: "Prominently displayed local police, fire, women helpline (1090), ambulance (108), and childline (1098).", weight: 0.8, maxScore: 10 },
  { category: "Library & Study Materials", title: "Trade Toolkits, Manuals & Reference Books", description: "Availability of NSDC/SSC prescribed student handbooks, trade blueprints, and digital learning modules.", weight: 0.8, maxScore: 10 },
  { category: "Accessibility (Ramp/Lift)", title: "Divyangjan / Wheelchair Ramp & Handrails", description: "Smooth gradient ramp (1:12) with stainless steel handrails at main entrance for persons with disabilities.", weight: 1.0, maxScore: 10 },
  { category: "Overall Cleanliness & Hygiene", title: "Daily Housekeeping & Waste Disposal", description: "Color-coded wet/dry waste bins, daily cleanliness logbook, sanitization of shared equipment.", weight: 1.0, maxScore: 10 },
];

async function main() {
  console.log("Starting database cleanup and seeding...");
  
  // Clean up existing data in proper dependency order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.inspectionResponse.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.studentAttendance.deleteMany();
  await prisma.trainerAttendance.deleteMany();
  await prisma.student.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.centre.deleteMany();

  const commonPassword = await bcrypt.hash("demo123", 10);

  // 1. Create Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@tcms.gov.in",
      passwordHash: commonPassword,
      name: "Dr. Rajeshwar Sharma",
      role: "SUPER_ADMIN",
      phone: "+91 98100 12345",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    },
  });
  console.log("Created Super Admin:", adminUser.email);

  // 2. Create 3 District Officers
  const officerJaipur = await prisma.user.create({
    data: {
      email: "officer.jaipur@tcms.gov.in",
      passwordHash: commonPassword,
      name: "Smt. Sunita Verma, IAS",
      role: "DISTRICT_OFFICER",
      district: "Jaipur",
      state: "Rajasthan",
      phone: "+91 94140 22334",
    },
  });

  const officerPune = await prisma.user.create({
    data: {
      email: "officer.pune@tcms.gov.in",
      passwordHash: commonPassword,
      name: "Shri Anand Kulkarni",
      role: "DISTRICT_OFFICER",
      district: "Pune",
      state: "Maharashtra",
      phone: "+91 98220 33445",
    },
  });

  const officerLucknow = await prisma.user.create({
    data: {
      email: "officer.lucknow@tcms.gov.in",
      passwordHash: commonPassword,
      name: "Dr. Arvind Tripathi",
      role: "DISTRICT_OFFICER",
      district: "Lucknow",
      state: "Uttar Pradesh",
      phone: "+91 94150 44556",
    },
  });
  console.log("Created District Officers");

  // 3. Create Courses
  const createdCourses = [];
  for (const c of courseDefs) {
    const course = await prisma.course.create({ data: c });
    createdCourses.push(course);
  }

  // 4. Create Checklist Items
  const createdChecklistItems = [];
  for (const item of checklistCategories) {
    const checkItem = await prisma.checklistItem.create({ data: item });
    createdChecklistItems.push(checkItem);
  }

  // 5. Create 25 Centres across 5 states
  const createdCentres = [];
  for (let i = 0; i < statesDistricts.length; i++) {
    const loc = statesDistricts[i];
    const code = `TC-${loc.state.substring(0, 2).toUpperCase()}-${loc.district.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`;
    const centreName = `Pradhan Mantri Kaushal Kendra (${loc.district} Hub ${i + 1})`;
    
    // Assign varying realistic compliance scores
    // Some excellent (90-96), some good (75-88), some partial (55-72), some critical (<50)
    let complianceScore = 86.5;
    let complianceGrade = "COMPLIANT";
    if (i === 3 || i === 8 || i === 13) {
      complianceScore = 48.0; // Critical non-compliant centres to trigger alerts
      complianceGrade = "CRITICAL";
    } else if (i === 6 || i === 11 || i === 18) {
      complianceScore = 67.5; // Partial
      complianceGrade = "PARTIAL";
    } else if (i === 0 || i === 5 || i === 10 || i === 15) {
      complianceScore = 95.0; // Excellent flagship centre
      complianceGrade = "EXCELLENT";
    } else {
      complianceScore = 78.0 + (i % 10);
      complianceGrade = "COMPLIANT";
    }

    const centre = await prisma.centre.create({
      data: {
        code,
        name: centreName,
        address: `Plot ${100 + i * 12}, Sector ${((i % 7) + 1)}, Industrial Area, Near City Bus Stand`,
        district: loc.district,
        state: loc.state,
        pincode: `${300000 + i * 1234}`,
        latitude: loc.lat,
        longitude: loc.lng,
        geoRadiusMeters: 250,
        capacity: 120 + (i % 4) * 30,
        contactEmail: `centre.${loc.district.toLowerCase().replace(/\s+/g, "")}@tcms.gov.in`,
        contactPhone: `+91 ${9800000000 + i * 1111}`,
        status: i === 13 ? "SUSPENDED" : "APPROVED",
        affiliationNumber: `NSDC-TC-${202400 + i}`,
        complianceScore,
        complianceGrade,
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1562774053-701939374585?w=600",
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600"
        ]),
      },
    });
    createdCentres.push(centre);

    // Create Centre Manager for this centre
    const mgrEmail = i === 0 ? "manager.jaipur@tcms.gov.in" : i === 5 ? "manager.pune@tcms.gov.in" : `manager.${loc.district.toLowerCase().replace(/\s+/g, "")}${i}@tcms.gov.in`;
    await prisma.user.create({
      data: {
        email: mgrEmail,
        passwordHash: commonPassword,
        name: `Manager ${loc.district} Centre`,
        role: "CENTRE_MANAGER",
        centreId: centre.id,
        district: loc.district,
        state: loc.state,
        phone: `+91 97000${String(i).padStart(5, "0")}`,
      },
    });
  }
  console.log(`Created ${createdCentres.length} Centres & Managers`);

  // 6. Create 60 Trainers, 40 Batches, 800 Students
  const createdTrainers = [];
  const trainerSpecializations = ["Renewable Energy", "Embedded Systems", "Full Stack Web", "Nursing & Patient Care", "Precision Machining", "Data Analytics"];
  
  let trainerCount = 0;
  for (const centre of createdCentres) {
    // 2-3 trainers per centre
    const numTrainers = (trainerCount % 2 === 0) ? 3 : 2;
    for (let t = 0; t < numTrainers; t++) {
      trainerCount++;
      const trainerEmail = trainerCount === 1 ? "trainer.rajesh@tcms.gov.in" : trainerCount === 2 ? "trainer.priya@tcms.gov.in" : `trainer.${centre.district.toLowerCase()}.${t + 1}@tcms.gov.in`;
      const trainerName = trainerCount === 1 ? "Er. Rajesh Kumar" : trainerCount === 2 ? "Ms. Priya Deshmukh" : `Trainer ${centre.district} ${t + 1}`;
      
      const tUser = await prisma.user.create({
        data: {
          email: trainerEmail,
          passwordHash: commonPassword,
          name: trainerName,
          role: "TRAINER",
          centreId: centre.id,
          phone: `+91 96000${String(trainerCount).padStart(5, "0")}`,
        },
      });

      const trainer = await prisma.trainer.create({
        data: {
          userId: tUser.id,
          centreId: centre.id,
          employeeCode: `EMP-TR-${String(trainerCount).padStart(4, "0")}`,
          specialization: trainerSpecializations[trainerCount % trainerSpecializations.length],
          qualification: trainerCount % 2 === 0 ? "B.Tech Mechanical / CS" : "Diploma / Master in Skill Trade",
          experienceYears: 3 + (trainerCount % 7),
          isActive: true,
        },
      });
      createdTrainers.push({ ...trainer, user: tUser });
    }
  }
  console.log(`Created ${createdTrainers.length} Trainers`);

  // 7. Create 40 Batches & 800 Students
  const createdBatches = [];
  let batchCount = 0;
  let studentCount = 0;
  const createdStudents = [];

  for (let i = 0; i < createdCentres.length && batchCount < 40; i++) {
    const centre = createdCentres[i];
    const centreTrainers = createdTrainers.filter((t) => t.centreId === centre.id);
    const assignedTrainer = centreTrainers[0] || createdTrainers[0];
    
    // 1-2 batches per centre
    const numBatches = (i % 2 === 0) ? 2 : 1;
    for (let b = 0; b < numBatches && batchCount < 40; b++) {
      batchCount++;
      const course = createdCourses[batchCount % createdCourses.length];
      const batchCode = `BTH-${course.code.substring(4, 8)}-${String(batchCount).padStart(3, "0")}`;
      
      const batch = await prisma.batch.create({
        data: {
          code: batchCode,
          name: `${course.name} - Batch ${batchCount}`,
          courseId: course.id,
          centreId: centre.id,
          trainerId: assignedTrainer.id,
          startDate: daysAgo(65),
          endDate: daysAgo(-25),
          timing: b === 0 ? "09:00 AM - 01:00 PM (Morning)" : "02:00 PM - 06:00 PM (Afternoon)",
          maxStudents: 30,
          status: "ONGOING",
        },
      });
      createdBatches.push(batch);

      // Create 20 students per batch (40 batches * 20 = 800 students)
      for (let s = 1; s <= 20; s++) {
        studentCount++;
        const studentEmail = studentCount === 1 ? "student.rohit@tcms.gov.in" : studentCount === 2 ? "student.ananya@tcms.gov.in" : `student${studentCount}@tcms.gov.in`;
        const studentName = studentCount === 1 ? "Rohit Sharma" : studentCount === 2 ? "Ananya Kulkarni" : `Student Trainee ${studentCount}`;

        // Create user account for first few students so they can log in
        let studentUserId = null;
        if (studentCount <= 5) {
          const sUser = await prisma.user.create({
            data: {
              email: studentEmail,
              passwordHash: commonPassword,
              name: studentName,
              role: "STUDENT",
              centreId: centre.id,
              phone: `+91 91000${String(studentCount).padStart(5, "0")}`,
            },
          });
          studentUserId = sUser.id;
        }

        const student = await prisma.student.create({
          data: {
            userId: studentUserId,
            centreId: centre.id,
            batchId: batch.id,
            registrationNo: `REG-2024-${String(studentCount).padStart(5, "0")}`,
            name: studentName,
            fatherName: `Father of ${studentName.split(" ")[0]}`,
            gender: s % 3 === 0 ? "Female" : "Male",
            phone: `+91 91000${String(studentCount).padStart(5, "0")}`,
            email: studentEmail,
            address: `House #${10 + s}, Village/Ward ${s % 12}, ${centre.district}`,
          },
        });
        createdStudents.push(student);
      }
    }
  }
  console.log(`Created ${createdBatches.length} Batches & ${createdStudents.length} Students`);

  // 8. Generate 60 Days of Realistic Attendance History
  console.log("Generating 60 days of attendance history...");
  const attendanceBatches = createdBatches.slice(0, 10); // Dense history for top 10 batches to keep seed snappy
  const attendanceDays = 60;

  for (let dayOffset = attendanceDays; dayOffset >= 0; dayOffset--) {
    const attendanceDate = daysAgo(dayOffset);
    // Skip Sundays
    if (attendanceDate.getDay() === 0) continue;

    for (const batch of attendanceBatches) {
      const batchStudents = createdStudents.filter((s) => s.batchId === batch.id);
      const centre = createdCentres.find((c) => c.id === batch.centreId);
      const isLowAttendanceCentre = centre?.complianceScore && centre.complianceScore < 60;

      // Realistic attendance probability
      const basePresentRate = isLowAttendanceCentre ? 0.62 : 0.88;

      for (const st of batchStudents) {
        const rand = Math.random();
        let status = "PRESENT";
        if (rand > basePresentRate) {
          status = rand > basePresentRate + 0.08 ? "ABSENT" : "LATE";
        }

        await prisma.studentAttendance.create({
          data: {
            studentId: st.id,
            batchId: batch.id,
            date: attendanceDate,
            status,
            markedByUserId: adminUser.id,
            markedAt: attendanceDate,
            verificationMethod: dayOffset % 3 === 0 ? "QR_SCAN" : dayOffset % 5 === 0 ? "FACE_AI" : "MANUAL",
            geoLatitude: centre ? centre.latitude + (Math.random() - 0.5) * 0.0005 : 26.9124,
            geoLongitude: centre ? centre.longitude + (Math.random() - 0.5) * 0.0005 : 75.7873,
            isGeoValid: true,
            editLocked: dayOffset > 1, // 24-hr edit lock rule!
            lockedAt: dayOffset > 1 ? daysAgo(dayOffset - 1) : null,
          },
        });
      }
    }
  }
  console.log("Generated 60 days student attendance history");

  // 9. Generate Trainer Attendance for the last 30 days
  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const d = daysAgo(dayOffset);
    if (d.getDay() === 0) continue;

    for (const trainer of createdTrainers.slice(0, 15)) {
      const centre = createdCentres.find((c) => c.id === trainer.centreId);
      const isLate = Math.random() < 0.15;
      const lateMinutes = isLate ? Math.floor(Math.random() * 45) + 10 : 0;
      
      const checkInTime = new Date(d);
      checkInTime.setHours(8, 45 + (isLate ? lateMinutes : 0), 0);
      const checkOutTime = new Date(d);
      checkOutTime.setHours(17, 15, 0);

      await prisma.trainerAttendance.create({
        data: {
          trainerId: trainer.id,
          centreId: trainer.centreId,
          date: d,
          checkInTime,
          checkOutTime,
          checkInLat: centre?.latitude,
          checkInLng: centre?.longitude,
          isCheckInGeoValid: true,
          checkInSelfieUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          status: isLate ? "LATE" : "PRESENT",
          lateMinutes,
        },
      });
    }
  }
  console.log("Generated Trainer attendance records");

  // 10. Create Realistic Inspections with Photos & Scores
  for (let i = 0; i < 8; i++) {
    const centre = createdCentres[i];
    const isOfficer = i % 2 === 0;
    const inspector = isOfficer ? officerJaipur : adminUser;

    const inspection = await prisma.inspection.create({
      data: {
        centreId: centre.id,
        inspectorId: inspector.id,
        type: isOfficer ? "OFFICER_VERIFICATION" : "SELF_ASSESSMENT",
        status: "SUBMITTED",
        conductedDate: daysAgo(i * 3 + 2),
        totalScore: centre.complianceScore,
        complianceGrade: centre.complianceGrade,
        remarks: `Mandatory inspection for compliance audit. Verified laboratories, safety equipment and classroom rosters. Score: ${centre.complianceScore}%`,
      },
    });

    // Populate responses for all checklist items
    for (const item of createdChecklistItems) {
      let itemStatus = "COMPLIANT";
      let scoreAwarded = 10.0;
      if (centre.complianceScore < 60) {
        itemStatus = item.category === "Fire Safety" || item.category === "IT Lab & Computers" ? "NON_COMPLIANT" : "PARTIALLY_COMPLIANT";
        scoreAwarded = itemStatus === "NON_COMPLIANT" ? 0 : 5;
      }

      const resp = await prisma.inspectionResponse.create({
        data: {
          inspectionId: inspection.id,
          checklistItemId: item.id,
          status: itemStatus,
          scoreAwarded,
          remarks: `Checked on-site. Condition observed is ${itemStatus.toLowerCase().replace(/_/g, " ")}.`,
        },
      });

      // Attach evidence photos for critical items (Fire Safety, IT Lab, CCTV, Ramp)
      if (item.category === "Fire Safety" || item.category === "IT Lab & Computers") {
        await prisma.evidence.create({
          data: {
            inspectionId: inspection.id,
            inspectionResponseId: resp.id,
            photoUrl: item.category === "Fire Safety"
              ? "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600"
              : "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
            latitude: centre.latitude,
            longitude: centre.longitude,
            itemTag: item.category === "Fire Safety" ? "FIRE_EXTINGUISHER" : "IT_LAB_PCS",
            verifiedByAi: true,
            aiDetectionResult: JSON.stringify({
              confidence: 0.94,
              detectedObjects: item.category === "Fire Safety" ? ["fire extinguisher", "pressure gauge", "inspection tag"] : ["25 desktop monitors", "UPS battery pack", "network switch"],
              complianceMatch: itemStatus === "COMPLIANT",
            }),
          },
        });
      }
    }
  }
  console.log("Created Inspections with checklist responses and Vision AI evidence");

  // 11. Create Open Critical & Escalated Alerts so dashboard is immediately alive
  const alertCentres = [createdCentres[3], createdCentres[8], createdCentres[13]];
  
  await prisma.alert.create({
    data: {
      centreId: alertCentres[0].id,
      ruleType: "LOW_STUDENT_ATTENDANCE",
      severity: "CRITICAL",
      title: "Batch Attendance Dropped to 42.5%",
      description: `Critical: Student attendance at ${alertCentres[0].name} for Solar Installer batch has remained below 50% for 5 consecutive days. Risk of de-affiliation.`,
      status: "OPEN",
    },
  });

  await prisma.alert.create({
    data: {
      centreId: alertCentres[1].id,
      ruleType: "LOW_COMPLIANCE_SCORE",
      severity: "CRITICAL",
      title: "Critical Infrastructure Non-Compliance (48%)",
      description: `Officer inspection found expired fire extinguishers and non-functional backup generator at ${alertCentres[1].name}.`,
      status: "OPEN",
    },
  });

  await prisma.alert.create({
    data: {
      centreId: alertCentres[2].id,
      ruleType: "TRAINER_ABSENT",
      severity: "HIGH",
      title: "Trainer Absent Without Prior Notice",
      description: `Er. Suresh Sen was not checked in by 09:30 AM for CNC Milling batch. No leave request submitted on portal.`,
      status: "ESCALATED",
      escalatedAt: daysAgo(2),
      escalatedToUserId: officerLucknow.id,
    },
  });

  await prisma.alert.create({
    data: {
      centreId: createdCentres[0].id,
      ruleType: "UNMARKED_ATTENDANCE",
      severity: "MEDIUM",
      title: "Morning Session Attendance Not Yet Finalized",
      description: `Attendance for Batch BTH-SOLA-001 is awaiting trainer submission.`,
      status: "OPEN",
    },
  });

  // 12. Create Welcome Notifications
  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      title: "TCMS Live Deployment Ready",
      message: "SIH26245 Training Centre Monitoring System initialized with 25 state centres and AI-ready modules.",
      type: "SYSTEM",
      isRead: false,
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
