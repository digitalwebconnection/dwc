import { useState } from 'react'

const services = ['Search Engine Optimization', 'Social Media Marketing', 'Pay-Per-Click (PPC)', 'Meta Ads', 'LinkedIn Marketing', 'Website Development', 'Graphic Design', 'Content Marketing']

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  company?: string
  service?: string
  message?: string
}

export default function ContactForm() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMsg, setResponseMsg] = useState('')

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full Name is required.'
        if (value.trim().length < 2) return 'Name must be at least 2 characters.'
        return undefined
      case 'email':
        if (!value.trim()) return 'Email Address is required.'
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) {
          return 'Please enter a valid email address (e.g. name@domain.com).'
        }
        return undefined
      case 'phone': {
        if (!value.trim()) return 'Phone number is required.'
        const digitsOnly = value.replace(/\D/g, '')
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
          return 'Please enter a valid 10-digit phone number.'
        }
        return undefined
      }
      case 'message':
        if (!value.trim()) return 'Project brief / message is required.'
        if (value.trim().length < 5) return 'Message must be at least 5 characters.'
        return undefined
      default:
        return undefined
    }
  }

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {}
    const nameErr = validateField('name', formState.name)
    if (nameErr) newErrors.name = nameErr

    const emailErr = validateField('email', formState.email)
    if (emailErr) newErrors.email = emailErr

    const phoneErr = validateField('phone', formState.phone)
    if (phoneErr) newErrors.phone = phoneErr

    const messageErr = validateField('message', formState.message)
    if (messageErr) newErrors.message = messageErr

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      phone: true,
      company: true,
      service: true,
      message: true
    })
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, (formState as any)[field] || '')
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateAll()) {
      return
    }

    setStatus('loading')
    setResponseMsg('')
    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'a825aac6-7cd8-4618-b763-f274d1f0d081'
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim(),
          company: formState.company.trim() || 'N/A',
          service: formState.service || 'General Inquiry',
          message: formState.message.trim(),
          subject: `New Lead: ${formState.name.trim()} (${formState.service || 'General Inquiry'})`,
          from_name: 'DWC Website Contact Form',
        }),
      })
      const data = await response.json()
      if (data.success) {
        setStatus('success')
        setResponseMsg('Thank you! Your inquiry has been submitted successfully. We will reach out within 24 hours.')
        setFormState({ name: '', email: '', phone: '', company: '', service: '', message: '' })
        setErrors({})
        setTouched({})
        setTimeout(() => {
          setStatus('idle')
          setResponseMsg('')
        }, 5000)
      } else {
        setStatus('error')
        setResponseMsg(data.message || 'Submission failed. Please check your details and try again.')
        setTimeout(() => {
          setStatus('idle')
          setResponseMsg('')
        }, 6000)
      }
    } catch {
      setStatus('error')
      setResponseMsg('Network connection error. Please check your internet and try again.')
      setTimeout(() => {
        setStatus('idle')
        setResponseMsg('')
      }, 6000)
    }
  }

  return (
    <section className="bg-[#020303] py-12 relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 data-aos="fade-up" className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-white tracking-tight">
          Let's <span className="bg-brand-gradient bg-clip-text text-transparent italic font-serif">Connect</span>
        </h2>
      </div>
      <div className="max-w-[1300px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left */}
        <div>
          <div data-aos="fade-right" className="inline-block font-mono text-[0.72rem] tracking-[0.2em] uppercase text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-5">
            Let's Connect
          </div>
          <h2 data-aos="fade-right" className="font-display font-bold text-[clamp(1.8rem,4vw,2.8rem)] text-white tracking-tight mb-6 leading-tight">
            Experience the{' '}
            <span className="gradient-text">DWC Advantage</span>
          </h2>
          <p data-aos="fade-right" data-aos-delay="100" className="text-white leading-relaxed mb-10 text-base max-w-xl">
            We've mastered the art of blending creativity and data to deliver marketing that maximizes your ROI. Let's build your roadmap to digital success. Fill in the form and our strategist will reach out within 24 hours.
          </p>

          {/* Social row */}
          <div data-aos="fade-up" data-aos-delay="200" className="flex gap-3 flex-wrap">
            {[
              { name: 'LinkedIn', href: 'https://in.linkedin.com/company/digitalwebconnection', color: 'hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10' },
              { name: 'Instagram', href: 'https://www.instagram.com/digitalwebconnection/', color: 'hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-[#E1306C]/10' },
              { name: 'Facebook', href: 'https://www.facebook.com/p/Digitalwebconnection-100092036863467/', color: 'hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/10' },
              { name: 'Twitter/X', href: 'https://x.com/Digiwebconnect', color: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10' },
            ].map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-5 py-2 rounded-full border border-white text-white no-underline text-[0.85rem] font-display font-medium transition-all duration-300 ${s.color}`}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div data-aos="fade-left" className="w-full">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="contact-form-container bg-white/5 backdrop-blur-xl border border-white/10 rounded-[20px] p-8 md:p-10 shadow-[0_0_50px_rgba(4,185,202,0.1)] relative z-10"
          >
            {/* Hidden Web3Forms honeypot to prevent spam */}
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid gap-5">
              {/* Name */}
              <div className="relative group">
                <input 
                  className={`peer w-full bg-black/20 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 placeholder-transparent ${
                    touched.name && errors.name
                      ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                      : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                  }`}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formState.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  id="contact-name" 
                />
                <label
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                    touched.name && errors.name
                      ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                      : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                  }`}
                  htmlFor="contact-name"
                >
                  Full Name *
                </label>
                {touched.name && errors.name && (
                  <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                    <span>⚠</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative group">
                <input 
                  className={`peer w-full bg-black/20 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 placeholder-transparent ${
                    touched.email && errors.email
                      ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                      : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                  }`}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formState.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  id="contact-email" 
                />
                <label
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                    touched.email && errors.email
                      ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                      : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                  }`}
                  htmlFor="contact-email"
                >
                  Email Address *
                </label>
                {touched.email && errors.email && (
                  <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phone */}
                <div className="relative group">
                  <input 
                    className={`peer w-full bg-black/20 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 placeholder-transparent ${
                      touched.phone && errors.phone
                        ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                    }`}
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formState.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    id="contact-phone" 
                  />
                  <label
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                      touched.phone && errors.phone
                        ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                        : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                    }`}
                    htmlFor="contact-phone"
                  >
                    Phone Number *
                  </label>
                  {touched.phone && errors.phone && (
                    <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                      <span>⚠</span> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div className="relative group">
                  <input 
                    className="peer w-full bg-black/20 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:border-cyan focus:bg-black/40 focus:ring-4 focus:ring-cyan/10 placeholder-transparent" 
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formState.company}
                    onChange={e => handleChange('company', e.target.value)}
                    id="contact-company" 
                  />
                  <label className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-focus:text-cyan peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] peer-[:not(:placeholder-shown)]:text-cyan" htmlFor="contact-company">
                    Company Name
                  </label>
                </div>
              </div>

              {/* Service */}
              <div className="relative group">
                <select
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white text-sm outline-none transition-all duration-300 focus:border-cyan focus:bg-black/40 focus:ring-4 focus:ring-cyan/10 appearance-none cursor-pointer"
                  name="service"
                  value={formState.service}
                  onChange={e => handleChange('service', e.target.value)}
                  id="contact-service"
                >
                  <option value="" className="text-dark bg-white">Select a Service (Optional)</option>
                  {services.map(s => <option key={s} value={s} className="text-dark bg-white">{s}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>

              {/* Message */}
              <div className="relative group">
                <textarea 
                  className={`peer w-full bg-black/20 border rounded-xl px-4 pt-8 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 min-h-[120px] resize-y placeholder-transparent ${
                    touched.message && errors.message
                      ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                      : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                  }`}
                  name="message"
                  placeholder="Project Brief"
                  rows={4} 
                  value={formState.message}
                  onChange={e => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  id="contact-message" 
                />
                <label
                  className={`absolute left-4 top-6 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                    touched.message && errors.message
                      ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                      : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                  }`}
                  htmlFor="contact-message"
                >
                  Project Brief *
                </label>
                {touched.message && errors.message && (
                  <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                    <span>⚠</span> {errors.message}
                  </p>
                )}
              </div>

              {/* Status Alert Banner */}
              {responseMsg && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-start gap-3 ${
                    status === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                  }`}
                >
                  {status === 'success' ? (
                    <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  )}
                  <span className="leading-relaxed">{responseMsg}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`w-full p-4 rounded-xl font-display font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg group cursor-pointer
                  ${status === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 
                    status === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' :
                    'bg-brand-gradient text-dark hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(4,185,202,0.4)]'}`}
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'idle' && <>Submit<svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
                {status === 'loading' && <><div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />Sending...</>}
                {status === 'success' && <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Message Sent!</>}
                {status === 'error' && <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Failed — Try Again</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

