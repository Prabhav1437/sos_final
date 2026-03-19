import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Save to database
    const user = await prisma.user.create({
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
          create: data.contacts || [] // Array of {name, contactLocal, contactOut, relationship}
        }
      }
    })

    // Determine base URL:
    // If NEXT_PUBLIC_SITE_URL is set (production), use it.
    // Otherwise, discover local IP so it can be scanned by a phone on the same WiFi!
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      const os = require('os');
      const interfaces = os.networkInterfaces();
      let localIp = 'localhost';
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
          if (iface.family === 'IPv4' && !iface.internal) {
            localIp = iface.address;
            break;
          }
        }
        if (localIp !== 'localhost') break;
      }
      baseUrl = `http://${localIp}:3000`;
    }

    const url = `${baseUrl}/user/${user.id}`

    // Run python script
    const pyScript = `${process.cwd()}/qr_generator.py`
    const pyVenv = `${process.cwd()}/.venv/bin/python`
    const { stdout, stderr } = await execAsync(`"${pyVenv}" "${pyScript}" "${url}"`)

    if (stderr && stderr.trim()) {
      console.warn("Python runtime warning:", stderr)
    }

    const qrBase64 = stdout.trim()

    return NextResponse.json({ success: true, user, qrCode: qrBase64 })

  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}
