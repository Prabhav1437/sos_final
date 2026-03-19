import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, FileText, QrCode } from 'lucide-react'

// Note: For a real app, protect this route with auth!
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { contacts: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
              <Users className="text-blue-600" /> S.O.S Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Overview of all registered emergency profiles.</p>
          </div>
          <Link href="/" className="bg-white border border-slate-300 hover:bg-slate-50 font-semibold px-4 py-2 rounded-lg transition-colors">
            Back to Home
          </Link>
        </header>

        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-800">Total Profiles: {users.length}</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold rounded-tl-xl">Name & Address</th>
                  <th className="p-4 font-semibold">Blood Group</th>
                  <th className="p-4 font-semibold">Emergency Contacts</th>
                  <th className="p-4 font-semibold">Date Registered</th>
                  <th className="p-4 font-semibold rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-slate-500 text-xs truncate max-w-xs">{u.address}</p>
                    </td>
                    <td className="p-4 font-bold text-red-500">{u.bloodGroup || 'N/A'}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-semibold">
                        {u.contacts.length} Contacts
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-2">
                       <Link href={`/user/${u.id}`} target="_blank" className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition">
                         <FileText size={16} /> View
                       </Link>
                       <Link href={`/dashboard/${u.id}/edit`} className="flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg transition">
                         Edit
                       </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium italic">
                      No SOS profiles registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
