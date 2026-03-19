'use client';
import { useState, FormEvent } from 'react';
import { Camera, User, Phone, Activity, FileText, ChevronRight, Check, HeartPulse, ShieldAlert, ArrowLeft, QrCode } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 'personal', title: 'Personal Details', description: 'Basic identity & life stats', icon: User },
  { id: 'emergency', title: 'Emergency Contacts', description: 'Who should we call?', icon: Phone },
  { id: 'medical', title: 'Medical History', description: 'Crucial health data', icon: Activity },
  { id: 'insurance', title: 'Health Insurance', description: 'Financial & hospital coverage', icon: FileText },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({ contacts: [{}, {}, {}] });
  const [loading, setLoading] = useState(false);
  const [resultQR, setResultQR] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' })); // clear error
  };

  const updateContact = (index: number, key: string, value: any) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [key]: value };
    setFormData((prev: any) => ({ ...prev, contacts: updatedContacts }));
    setErrors(prev => ({ ...prev, [`contact_${index}_${key}`]: '' }));
  };

  const validateStep = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.name) { newErrors.name = 'Name is required'; isValid = false; }
      if (!formData.address) { newErrors.address = 'Address is required'; isValid = false; }
      if (!formData.height) { newErrors.height = 'Height is required'; isValid = false; }
      if (!formData.weight) { newErrors.weight = 'Weight is required'; isValid = false; }
    } else if (currentStep === 1) {
      // Must have at least the first contact
      const c1 = formData.contacts[0];
      if (!c1.name) { newErrors.contact_0_name = 'First contact name is required'; isValid = false; }
      if (!c1.relationship) { newErrors.contact_0_relationship = 'Relationship is required'; isValid = false; }
      if (!c1.contactLocal) { newErrors.contact_0_contactLocal = 'Local contact number is required'; isValid = false; }
    } else if (currentStep === 2) {
      if (!formData.bloodGroup) { newErrors.bloodGroup = 'Blood group is required'; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const filteredContacts = formData.contacts.filter((c: any) => c.name && c.contactLocal && c.relationship);
      const submitData = { ...formData, contacts: filteredContacts };

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (data.success) {
        setResultQR(data.qrCode);
        setUserId(data.user.id);
      } else {
        alert('Failed to save data. Please try again.');
      }
    } catch (err) {
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (resultQR) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-sky-50 to-sky-100 selection:bg-blue-200">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 max-w-lg w-full text-center space-y-8 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400"></div>
          
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-emerald-50/50">
            <Check size={48} strokeWidth={3} />
          </div>
          
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Activated</h1>
            <p className="text-slate-500 mt-3 text-lg leading-relaxed">
              Your emergency profile is live. Save this QR code. First responders scan it to access your life-saving data.
            </p>
          </div>

          <div className="bg-yellow-400 p-5 rounded-3xl inline-block mx-auto border-[6px] border-yellow-500 shadow-xl shadow-yellow-500/20 transform hover:scale-105 transition duration-500">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={resultQR} alt="SOS QR Code" className="w-[18rem] h-[18rem] object-contain rounded-xl bg-yellow-400 mix-blend-multiply" />
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={resultQR} download={`SOS_QR_${formData.name.replace(/\s+/g, '_')}.png`} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center">
                Download QR Code
              </a>
              <a href={`/user/${userId}`} target="_blank" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center">
                View Live Profile
              </a>
            </div>
            <Link href="/" className="block text-slate-500 font-semibold hover:text-blue-600 transition-colors mt-6">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const InputError = ({ msg }: { msg?: string }) => {
    return msg ? <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1"><ShieldAlert size={12}/> {msg}</p> : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 lg:gap-12 min-h-screen">
        
        {/* Left Sidebar Layout */}
        <div className="w-full lg:w-[35%] bg-gradient-to-br from-blue-900 to-sky-800 text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[30vw] h-[30vw] bg-blue-500 rounded-full filter blur-[100px] opacity-30"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white font-semibold mb-12 transition-colors">
              <ArrowLeft size={18} /> Back Home
            </Link>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                <HeartPulse size={32} className="text-red-400" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">S.O.S Registration</h1>
            </div>
            
            <p className="text-blue-100 text-lg leading-relaxed mb-12 font-light">
              We need accurate information. This platform is used exclusively by emergency responders to save critical minutes when treating you.
            </p>

            <div className="hidden lg:flex flex-col gap-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === idx;
                const isPast = currentStep > idx;
                return (
                  <div key={idx} className={`flex items-start gap-5 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-3' : 'opacity-50 hover:opacity-75'}`}>
                    <div className={`mt-1 shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-white text-blue-600 shadow-lg shadow-white/20' : isPast ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300 border border-white/10'}`}>
                      {isPast ? <Check size={24} strokeWidth={3} /> : <Icon size={24} />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-blue-100'}`}>{step.title}</h4>
                      <p className={`text-sm ${isActive ? 'text-blue-200' : 'text-blue-300/60'} font-medium`}>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-12 text-sm text-blue-300/60 font-medium relative z-10 hidden lg:block">
            Step {currentStep + 1} of {steps.length} • Secure Connection
          </div>
        </div>

        {/* Right Form Container */}
        <div className="w-full lg:w-[65%] p-6 py-12 lg:p-14 bg-white/50 relative">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (currentStep < steps.length - 1) handleNext();
            }}>
              <div className="mb-10 flex items-center gap-4">
                {(() => { const Icon = steps[currentStep].icon; return <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Icon size={28} /></div> })()}
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{steps[currentStep].title}</h2>
                  <p className="text-slate-500 font-medium">{steps[currentStep].description}</p>
                </div>
              </div>

              {/* STEP 0: Personal */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-center mb-8">
                     <div className="w-28 h-28 bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 rounded-full hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer group">
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <Camera size={28} className="mx-auto mb-1" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Add Photo</span>
                        </div>
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Legal Name <span className="text-red-500">*</span></label>
                    <input type="text" className={`w-full rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 font-medium`} placeholder="e.g. Jane Doe" value={formData.name || ''} onChange={(e) => updateForm('name', e.target.value)} />
                    <InputError msg={errors.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Residential Address <span className="text-red-500">*</span></label>
                    <textarea className={`w-full rounded-xl border ${errors.address ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 font-medium`} rows={3} placeholder="Apartment, Street, City, State, ZIP" value={formData.address || ''} onChange={(e) => updateForm('address', e.target.value)} />
                    <InputError msg={errors.address} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Height <span className="text-red-500">*</span></label>
                      <input type="text" className={`w-full rounded-xl border ${errors.height ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 font-medium`} placeholder="e.g. 175 cm" value={formData.height || ''} onChange={(e) => updateForm('height', e.target.value)} />
                      <InputError msg={errors.height} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Weight <span className="text-red-500">*</span></label>
                      <input type="text" className={`w-full rounded-xl border ${errors.weight ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 font-medium`} placeholder="e.g. 70 kg" value={formData.weight || ''} onChange={(e) => updateForm('weight', e.target.value)} />
                      <InputError msg={errors.weight} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Emergency Contacts */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-4">
                    <ShieldAlert className="text-blue-500 shrink-0 mt-1" />
                    <p className="text-sm text-blue-800 font-medium">Primary contact (Contact 1) is mandatory. We recommend providing at least two contacts in case one is unreachable.</p>
                  </div>
                  
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                          {idx + 1}
                        </div>
                        <h3 className="font-bold text-slate-800">Emergency Contact {idx + 1} {idx === 0 && <span className="text-red-500 ml-1">*</span>}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                          <input type="text" className={`w-full rounded-lg border ${errors[`contact_${idx}_name`] ? 'border-red-400' : 'border-slate-300'} px-4 py-2.5 outline-none focus:border-blue-500 transition-all`} placeholder="Name" value={formData.contacts[idx]?.name || ''} onChange={(e) => updateContact(idx, 'name', e.target.value)} />
                          <InputError msg={errors[`contact_${idx}_name`]} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Relationship</label>
                          <select className={`w-full rounded-lg border ${errors[`contact_${idx}_relationship`] ? 'border-red-400' : 'border-slate-300'} px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-medium text-slate-700`} value={formData.contacts[idx]?.relationship || ''} onChange={(e) => updateContact(idx, 'relationship', e.target.value)}>
                            <option value="">Select...</option>
                            <option value="Family">Family</option>
                            <option value="Friend">Friend</option>
                            <option value="Colleague">Work Place Colleague</option>
                          </select>
                          <InputError msg={errors[`contact_${idx}_relationship`]} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Local Number</label>
                          <input type="tel" className={`w-full rounded-lg border ${errors[`contact_${idx}_contactLocal`] ? 'border-red-400' : 'border-slate-300'} px-4 py-2.5 outline-none focus:border-blue-500 transition-all`} placeholder="+1..." value={formData.contacts[idx]?.contactLocal || ''} onChange={(e) => updateContact(idx, 'contactLocal', e.target.value)} />
                          <InputError msg={errors[`contact_${idx}_contactLocal`]} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Out Station No. (Optional)</label>
                          <input type="tel" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 transition-all" placeholder="+1..." value={formData.contacts[idx]?.contactOut || ''} onChange={(e) => updateContact(idx, 'contactOut', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: Medical History */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group <span className="text-red-500">*</span></label>
                      <select className={`w-full rounded-xl border ${errors.bloodGroup ? 'border-red-400 bg-red-50' : 'border-slate-300'} px-4 py-3 outline-none focus:border-blue-500 font-bold text-red-600 transition-all`} value={formData.bloodGroup || ''} onChange={(e) => updateForm('bloodGroup', e.target.value)}>
                        <option value="">Select Blood Group...</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                      </select>
                      <InputError msg={errors.bloodGroup} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">COVID Vaccination Status</label>
                      <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-700" value={formData.covidVaccination || ''} onChange={(e) => updateForm('covidVaccination', e.target.value)}>
                        <option value="">Select Status...</option>
                        <option value="Fully Vaccinated">Fully Vaccinated</option>
                        <option value="Partially Vaccinated">Partially Vaccinated</option>
                        <option value="Not Vaccinated">Not Vaccinated</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2"><Activity size={20} /> Allergies & Conditions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-red-700 uppercase mb-2">Drug Allergies</label>
                        <input type="text" className="w-full rounded-lg border border-red-200 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all" placeholder="e.g. Penicillin, None" value={formData.drugAllergy || ''} onChange={(e) => updateForm('drugAllergy', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-red-700 uppercase mb-2">Food Allergies</label>
                        <input type="text" className="w-full rounded-lg border border-red-200 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all" placeholder="e.g. Peanuts, None" value={formData.foodAllergy || ''} onChange={(e) => updateForm('foodAllergy', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-red-700 uppercase mb-2">Blood Pressure (BP)</label>
                        <input type="text" className="w-full rounded-lg border border-red-200 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all" placeholder="e.g. 120/80" value={formData.bloodPressure || ''} onChange={(e) => updateForm('bloodPressure', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-red-700 uppercase mb-2">Sugar / Diabetic</label>
                        <input type="text" className="w-full rounded-lg border border-red-200 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all" placeholder="e.g. Type 2, None" value={formData.sugar || ''} onChange={(e) => updateForm('sugar', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Family Doctor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Doctor Name</label>
                        <input type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 transition-all" value={formData.doctorName || ''} onChange={(e) => updateForm('doctorName', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Doctor Contact</label>
                        <input type="tel" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 transition-all" value={formData.doctorContact || ''} onChange={(e) => updateForm('doctorContact', e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Doctor Clinic Address</label>
                         <input type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 transition-all" value={formData.doctorAddress || ''} onChange={(e) => updateForm('doctorAddress', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Spectacle Vision Power (Optional)</label>
                    <input type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" placeholder="e.g. L: -1.5, R: -2.0" value={formData.visionPower || ''} onChange={(e) => updateForm('visionPower', e.target.value)} />
                  </div>
                </div>
              )}

              {/* STEP 3: Insurance */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200">
                  <div className="text-center mb-8">
                    <FileText size={48} className="mx-auto text-blue-300 mb-4" />
                    <p className="text-slate-500 font-medium">All health insurance details below are optional but highly recommended.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Insurance Company</label>
                      <input type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-900" value={formData.insuranceCompany || ''} onChange={(e) => updateForm('insuranceCompany', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Policy Number</label>
                      <input type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold text-slate-900 tracking-wider" value={formData.insurancePolicyNo || ''} onChange={(e) => updateForm('insurancePolicyNo', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Cashless Hospital</label>
                      <input type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" placeholder="e.g. Imperial Hospital" value={formData.insuranceHospital || ''} onChange={(e) => updateForm('insuranceHospital', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Cashless Card Number</label>
                      <input type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all font-mono" value={formData.insuranceCashlessCard || ''} onChange={(e) => updateForm('insuranceCashlessCard', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Policy Validity</label>
                      <input type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" placeholder="e.g. Dec 2026" value={formData.insuranceValidity || ''} onChange={(e) => updateForm('insuranceValidity', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Agent / Insurance Helpline Number</label>
                      <input type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 transition-all" placeholder="1800..." value={formData.insuranceAgentContact || ''} onChange={(e) => updateForm('insuranceAgentContact', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`py-3 px-6 rounded-xl font-bold transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100 border border-slate-300 active:scale-95'}`}
                >
                  Back
                </button>
                
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 font-bold flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitForm}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-10 rounded-xl shadow-xl shadow-emerald-500/30 font-black flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-wide"
                  >
                    {loading ? 'Activating Profile...' : 'Complete & Generate QR'} <QrCode size={20} />
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
