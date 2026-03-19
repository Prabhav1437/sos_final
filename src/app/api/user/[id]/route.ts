import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { contacts: true }
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    
    // Delete existing emergency contacts to replace them cleanly
    await prisma.emergencyContact.deleteMany({
      where: { userId: id }
    });

    // Create the clean contacts list (stripping id mapping from old records if any)
    const cleanContacts = (data.contacts || []).map((c: any) => ({
      name: c.name,
      contactLocal: c.contactLocal,
      contactOut: c.contactOut,
      relationship: c.relationship
    }));

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        height: data.height,
        weight: data.weight,
        photoUrl: data.photoUrl,
        
        doctorName: data.doctorName,
        doctorContact: data.doctorContact,
        doctorAddress: data.doctorAddress,

        visionPower: data.visionPower,
        bloodPressure: data.bloodPressure,
        sugar: data.sugar,
        bloodGroup: data.bloodGroup,
        allergies: data.allergies,
        covidVaccination: data.covidVaccination,
        bloodDonorContactName: data.bloodDonorContactName,
        bloodDonorContactPhone: data.bloodDonorContactPhone,
        drugAllergy: data.drugAllergy,
        foodAllergy: data.foodAllergy,

        insurancePolicyNo: data.insurancePolicyNo,
        insuranceCompany: data.insuranceCompany,
        insuranceHospital: data.insuranceHospital,
        insuranceCashlessCard: data.insuranceCashlessCard,
        insuranceCardUrl: data.insuranceCardUrl,
        insuranceValidity: data.insuranceValidity,
        insuranceAgentContact: data.insuranceAgentContact,

        contacts: {
          create: cleanContacts
        }
      }
    });

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}
