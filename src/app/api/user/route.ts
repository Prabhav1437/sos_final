import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { exec } from 'child_process'
import { promisify } from 'util'
import QRCode from 'qrcode'
import fs from 'fs'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // 1. Save to database
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
          create: (data.contacts || []).map((c: any) => ({
             name: c.name,
             contactLocal: c.contactLocal,
             contactOut: c.contactOut,
             relationship: c.relationship
          }))
        }
      }
    })

    // 2. Determine base URL (Production vs WiFi Local IP Dev)
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
    let qrBase64 = '';

    // 3. Attempt Python QR Generation (Honors User preference for Railway/Docker)
    try {
      const pyScript = `${process.cwd()}/qr_generator.py`
      
      // Use absolute path for Docker to avoid Turbopack "symlink out of root" errors
      let pyVenv = '/opt/venv/bin/python'
      
      // Fallback for local development if /opt/venv/bin/python doesn't exist
      if (!fs.existsSync(pyVenv)) {
         pyVenv = `${process.cwd()}/.venv/bin/python`
      }
      
      // Check if python environment exists
      if (fs.existsSync(pyVenv)) {
         const { stdout } = await execAsync(`"${pyVenv}" "${pyScript}" "${url}"`)
         qrBase64 = stdout.trim()
      } else {
         throw new Error("Python venv not found. Running Vercel-optimized fallback.")
      }
    } catch (pyError) {
      console.warn("Python QR generation failed - using TypeScript Fallback:", pyError)
      
      // 4. Node.js Fallback (for Vercel)
      // Matches the Yellow coding from the Python script
      qrBase64 = await QRCode.toDataURL(url, {
        color: {
          dark: '#000000',  // Black QR
          light: '#FFFF00'  // Yellow Background
        },
        margin: 4,
        width: 600
      })
    }

    return NextResponse.json({ success: true, user, qrCode: qrBase64 })

  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}
