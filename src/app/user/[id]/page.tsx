import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AlertCircle, PhoneCall, HeartPulse, Activity, User, ShieldCheck } from 'lucide-react'

// Define the interface so TS knows what `params` is since Next.js structure dictates it can be accessed
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserProfile({ params }: PageProps) {
  // `params` is an asynchronous promise in Next.js 15+ App Router
  const { id } = await params
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: { contacts: true }
  })

  if (!user) {
    return notFound()
  }

  // Fallback photo
  const photo = user.photoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=0D8ABC&color=fff";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Top Banner */}
      <div className="bg-red-600 text-white p-4 text-center sticky top-0 z-50 shadow-md animate-pulse">
        <h1 className="text-xl font-bold flex items-center justify-center gap-2">
          <AlertCircle /> EMERGENCY MEDICAL PROFILE
        </h1>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Personal Details */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
           <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
             <img src={photo} alt={user.name} className="w-full h-full object-cover" />
           </div>
           <div className="text-center md:text-left flex-1">
             <h2 className="text-3xl font-extrabold text-blue-900 mb-2 drop-shadow-sm">{user.name.toUpperCase()}</h2>
             <p className="text-slate-600 font-medium mb-3">{user.address}</p>
             <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200 shadow-sm">
                 Blood Group: <span className="text-red-600 ml-1 font-bold text-lg">{user.bloodGroup || 'N/A'}</span>
               </span>
               <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-semibold text-slate-700">
                 Height: {user.height || 'N/A'}
               </span>
               <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-semibold text-slate-700">
                 Weight: {user.weight || 'N/A'}
               </span>
             </div>
           </div>
        </section>

        {/* Emergency Contacts */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <h3 className="bg-blue-600 text-white font-bold p-4 flex items-center gap-2 border-b">
            <PhoneCall size={20} /> EMERGENCY CONTACTS
          </h3>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
             {user.contacts.length > 0 ? user.contacts.map((c, i) => (
                <div key={c.id} className="p-4 bg-red-50 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between">
                   <div>
                     <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{c.relationship}</p>
                     <p className="font-extrabold text-slate-900 text-lg mb-2">{c.name}</p>
                   </div>
                   <div className="space-y-2 flex-grow">
                     <a href={`tel:${c.contactLocal}`} className="flex items-center justify-between bg-white text-blue-700 font-bold px-3 py-2 rounded-lg border shadow-sm hover:bg-blue-50 active:scale-95 transition-transform">
                       <span>{c.contactLocal}</span>
                       <PhoneCall size={16} />
                     </a>
                     {c.contactOut && (
                       <a href={`tel:${c.contactOut}`} className="flex items-center justify-between bg-white text-slate-600 font-semibold px-3 py-2 rounded-lg border shadow-sm hover:bg-slate-50 active:scale-95 transition-transform">
                         <span className="text-sm">Out Station: {c.contactOut}</span>
                         <PhoneCall size={16} />
                       </a>
                     )}
                   </div>
                </div>
             )) : (
               <p className="text-slate-500 italic p-4 text-center col-span-2">No emergency contacts provided.</p>
             )}
          </div>
        </section>

        {/* Medical History */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <h3 className="bg-red-500 text-white font-bold p-4 flex items-center gap-2 border-b">
            <HeartPulse size={20} /> MEDICAL HISTORY
          </h3>
          <div className="p-0">
             <div className="grid grid-cols-2 divide-x divide-y border-b">
               <div className="p-4 bg-slate-50">
                 <p className="text-xs text-slate-500 font-bold uppercase">Allergies</p>
                 <p className="font-semibold text-red-600 break-words">{user.allergies || user.drugAllergy || user.foodAllergy || 'None Reported'}</p>
               </div>
               <div className="p-4">
                 <p className="text-xs text-slate-500 font-bold uppercase">Drug Allergies</p>
                 <p className="font-semibold text-red-600 break-words">{user.drugAllergy || 'None Reported'}</p>
               </div>
               <div className="p-4 bg-slate-50">
                 <p className="text-xs text-slate-500 font-bold uppercase">Blood Pressure</p>
                 <p className="font-semibold text-slate-800">{user.bloodPressure || 'N/A'}</p>
               </div>
               <div className="p-4 shadow-inner">
                 <p className="text-xs text-slate-500 font-bold uppercase">Sugar/Diabetic</p>
                 <p className="font-semibold text-slate-800">{user.sugar || 'N/A'}</p>
               </div>
               <div className="p-4">
                 <p className="text-xs text-slate-500 font-bold uppercase">Vision/Spectacles</p>
                 <p className="font-semibold text-slate-800">{user.visionPower || 'N/A'}</p>
               </div>
               <div className="p-4 bg-slate-50">
                 <p className="text-xs text-slate-500 font-bold uppercase">Covid Vaccination</p>
                 <p className="font-semibold text-slate-800">{user.covidVaccination || 'N/A'}</p>
               </div>
             </div>

             {/* Doctor Information */}
             {(user.doctorName || user.doctorContact) && (
               <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
                 <div>
                   <p className="text-xs text-blue-600 font-bold uppercase">Family Doctor</p>
                   <p className="font-extrabold text-blue-900">{user.doctorName}</p>
                 </div>
                 {user.doctorContact && (
                   <a href={`tel:${user.doctorContact}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm hover:bg-blue-700">
                     <PhoneCall size={16} /> Call
                   </a>
                 )}
               </div>
             )}
          </div>
        </section>

        {/* Insurance Information */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <h3 className="bg-slate-800 text-white font-bold p-4 flex items-center gap-2 border-b">
            <ShieldCheck size={20} /> MEDICAL INSURANCE
          </h3>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
             <div>
               <p className="text-slate-500 font-semibold mb-1">Company</p>
               <p className="font-bold text-slate-900 text-base">{user.insuranceCompany || 'N/A'}</p>
             </div>
             <div>
               <p className="text-slate-500 font-semibold mb-1">Policy NO.</p>
               <p className="font-bold text-slate-900 bg-slate-100 inline-block px-2 py-1 rounded">{user.insurancePolicyNo || 'N/A'}</p>
             </div>
             <div>
               <p className="text-slate-500 font-semibold mb-1">Cashless Card NO.</p>
               <p className="font-bold text-slate-900 bg-slate-100 inline-block px-2 py-1 rounded">{user.insuranceCashlessCard || 'N/A'}</p>
             </div>
             <div>
               <p className="text-slate-500 font-semibold mb-1">Validity</p>
               <p className="font-bold text-slate-900">{user.insuranceValidity || 'N/A'}</p>
             </div>
             <div className="md:col-span-2">
               <p className="text-slate-500 font-semibold mb-1">Preferred Hospital</p>
               <p className="font-bold text-slate-900">{user.insuranceHospital || 'N/A'}</p>
             </div>
          </div>
          {user.insuranceAgentContact && (
            <div className="bg-slate-100 p-4 border-t flex justify-between items-center">
              <span className="font-semibold text-slate-700 text-sm">Agent/Helpline</span>
              <a href={`tel:${user.insuranceAgentContact}`} className="text-blue-700 font-bold bg-white px-3 py-1.5 rounded border shadow-sm">
                {user.insuranceAgentContact}
              </a>
            </div>
          )}
        </section>

        {/* Essential Services (Static) */}
        <section className="bg-yellow-50 rounded-2xl border border-yellow-200 p-4 pb-6 mt-8">
           <h3 className="text-yellow-800 font-bold mb-4 text-center uppercase tracking-widest text-sm">National Emergency Helpline</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {name: 'Police', no: '100'},
                {name: 'Ambulance', no: '102'},
                {name: 'Fire', no: '101'},
                {name: 'Disaster', no: '108'},
                {name: 'Women Helpline', no: '1091'},
                {name: 'Child Helpline', no: '1098'}
              ].map(h => (
                <a key={h.name} href={`tel:${h.no}`} className="bg-white border rounded-xl p-3 text-center shadow-sm hover:shadow-md transition">
                  <p className="text-xs font-semibold text-slate-500 mb-1">{h.name}</p>
                  <p className="font-extrabold text-red-600 text-lg">{h.no}</p>
                </a>
              ))}
           </div>
        </section>

      </div>
    </div>
  )
}
