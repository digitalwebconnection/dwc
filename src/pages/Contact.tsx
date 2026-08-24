import { useState } from 'react'
import FAQ from '../components/home/FAQ'
import DotBackground from '../components/three/DotBackground'
import contact3dVisual from '../assets/ChatGPT_Image_Jun_25__2026__12_41_38_PM-removebg-preview.png'

const services = ['Search Engine Optimization', 'Social Media Marketing', 'Pay-Per-Click (PPC)', 'Meta Ads', 'LinkedIn Marketing', 'Website Development', 'Graphic Design', 'Content Marketing', 'Other']

interface ContactErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  service?: string
  message?: string
}

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', service: '', message: '' })
  const [errors, setErrors] = useState<ContactErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMsg, setResponseMsg] = useState('')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First Name is required.'
        if (value.trim().length < 2) return 'First Name must be at least 2 characters.'
        return undefined
      case 'lastName':
        if (!value.trim()) return 'Last Name is required.'
        if (value.trim().length < 2) return 'Last Name must be at least 2 characters.'
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
        if (!value.trim()) return 'Project requirements / message is required.'
        if (value.trim().length < 5) return 'Message must be at least 5 characters.'
        return undefined
      default:
        return undefined
    }
  }

  const validateAll = (): boolean => {
    const newErrors: ContactErrors = {}
    const fnErr = validateField('firstName', form.firstName)
    if (fnErr) newErrors.firstName = fnErr

    const lnErr = validateField('lastName', form.lastName)
    if (lnErr) newErrors.lastName = lnErr

    const emailErr = validateField('email', form.email)
    if (emailErr) newErrors.email = emailErr

    const phoneErr = validateField('phone', form.phone)
    if (phoneErr) newErrors.phone = phoneErr

    const msgErr = validateField('message', form.message)
    if (msgErr) newErrors.message = msgErr

    setErrors(newErrors)
    setTouched({
      firstName: true,
      lastName: true,
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
    const error = validateField(field, (form as any)[field] || '')
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    setMousePos({ x: clientX - left, y: clientY - top })
    setTilt({
      x: ((clientX - left) / width - 0.5) * 16,
      y: ((clientY - top) / height - 0.5) * -16
    })
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
          name: `${form.firstName} ${form.lastName}`.trim(),
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim() || 'N/A',
          service: form.service || 'General Inquiry',
          message: form.message.trim(),
          subject: `New Contact Inquiry from ${form.firstName} ${form.lastName}`.trim() || 'New Contact Inquiry - DWC Website',
          from_name: 'DWC Website Contact Form',
        }),
      })
      const data = await response.json()
      if (data.success) {
        setStatus('success')
        setResponseMsg('Thank you! Your message has been sent successfully. We will get back to you shortly.')
        setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', service: '', message: '' })
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
      setResponseMsg('Network connection error. Please try again later.')
      setTimeout(() => {
        setStatus('idle')
        setResponseMsg('')
      }, 6000)
    }
  }

  return (
    <main className="bg-black">

      {/* ─── HERO: Split-Screen Communication Hub ─── */}
      <section
        className="relative overflow-hidden bg-black no-splash min-h-screen lg:h-[100vh] flex items-center justify-center pt-28 pb-16 lg:pt-48 lg:pb-24 px-6 md:px-12"
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }) }}
      >
        {/* Giant rotated background element on the right-side top corner */}
        <div className="absolute -top-[10%] -right-[15%] w-[45vw] h-[45vw] min-w-[450px] min-h-[450px] bg-gradient-to-tr from-[#0D5EF6] via-[#088BF1] to-[#04B9CA] rotate-[20deg] rounded-[70px] pointer-events-none z-0 shadow-2xl" />

        {/* Cybernetic grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(13,94,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(13,94,246,0.025)_1px,transparent_1px)] bg-[size:42px_42px] pointer-events-none" />

        {/* DotBackground particles */}
        <DotBackground variant="float" opacity={0.10} />

        {/* Mouse spotlight */}
        {isHovered && (
          <div
            className="absolute w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[150px] pointer-events-none z-0"
            style={{ left: `${mousePos.x - 250}px`, top: `${mousePos.y - 250}px` }}
          />
        )}

        {/* Ambient glows */}
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan/5 rounded-full blur-[120px] md:blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[5%] w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-primary/6 rounded-full blur-[80px] md:blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

        {/* 12-col split grid */}
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

          {/* ── LEFT: Text Content ── */}
          <div className="lg:col-span-6 flex flex-col items-start text-left lg:-mt-10 -mt-5 w-full">

            {/* Badge */}
            <div
              data-aos="fade-down"
              className="inline-flex items-center gap-2.5 font-mono text-[0.78rem] tracking-[0.2em] uppercase text-cyan bg-cyan/8 border border-cyan/25 rounded-full px-5 py-1.5 mb-7 shadow-[0_0_20px_rgba(4,185,202,0.15)] hover:shadow-[0_0_35px_rgba(4,185,202,0.3)] transition-shadow duration-300 cursor-default select-none bg-white"
            >
              Get In Touch
            </div>

            {/* Headline */}
            <h1
              data-aos="fade-up"
              className="font-display font-bold text-[clamp(2.4rem,4.5vw,4rem)] text-white tracking-tighter leading-[1.1] mb-5"
            >
              Let's Build{' '}<br className="hidden lg:block" />
              Something{' '}
              <span className="gradient-text">Amazing</span>
            </h1>

            {/* Description */}
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="font-body text-lg text-zinc-400 leading-relaxed mb-10 max-w-[540px]"
            >
              Collaborate with our team to launch campaigns that win customers, elevate your brand, and drive real measurable growth.
            </p>

            {/* CTA Buttons */}
            <div data-aos="fade-up" data-aos-delay="150" className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+919998204044"
                className="inline-flex items-center gap-2 bg-brand-gradient text-dark font-display font-semibold px-7 py-3.5 rounded-full shadow-[0_0_25px_rgba(4,185,202,0.3)] hover:shadow-[0_0_40px_rgba(4,185,202,0.55)] hover:-translate-y-0.5 transition-all duration-300 shimmer-btn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Call Us Now
              </a>
            </div>
          </div>

          {/* ── RIGHT: 3D Visual ── */}
          <div className="lg:col-span-6 flex justify-center items-center relative lg:-mt-16 -mt-8 w-full z-10">
            {/* Ambient cyan backlight behind the 3D visual */}
            <div className="absolute w-[240px] h-[240px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] bg-cyan/15 rounded-full blur-[80px] md:blur-[100px] pointer-events-none z-0" />

            <img
              src={contact3dVisual}
              alt="3D Iridescent Contact Visual"
              className="w-full max-w-[280px] md:max-w-[380px] lg:max-w-[460px] xl:max-w-[550px] h-auto object-contain relative z-10 animate-float"
              style={{
                animationDuration: '8s',
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
                filter: isHovered ? 'drop-shadow(0 15px 30px rgba(13,94,246,0.3))' : 'drop-shadow(0 5px 15px rgba(13,94,246,0.1))',
              }}
            />
          </div>
        </div>
      </section>

      {/* Contact layout */}
      <section id="contact-form-section" className="bg-black px-8 relative overflow-hidden py-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Info */}
          <div>
            <h2 data-aos="fade-right" className="font-display font-bold text-3xl lg:text-4xl text-white mb-10 tracking-tight">
              Send us a message
            </h2>

            <div className="flex flex-col gap-6 mb-12">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: 'Office Address',
                  value: 'B-1103, Titanium City Center, Prahladnagar, Ahmedabad, Gujarat, India'
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: 'Email',
                  value: 'service@digitalwebconnection.com'
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  label: 'Phone',
                  value: '+91 99982 04044'
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  label: 'Response Time',
                  value: 'Within 24 hours guaranteed'
                },
              ].map((item, i) => (
                <div
                  key={i}
                  data-aos="fade-right"
                  data-aos-delay={`${i * 80}`}
                  className="flex items-start gap-5 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-mono text-[0.7rem] text-primary tracking-widest uppercase mb-1 font-bold">{item.label}</div>
                    <div className="font-body text-white text-lg">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div data-aos="fade-up" className="flex gap-3 flex-wrap">
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
                  className={`px-5 py-2.5 rounded-full border border-white/20 text-white/70 no-underline text-sm font-display font-semibold transition-all duration-300 ${s.color}`}
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
              className="contact-form-container bg-white/5 backdrop-blur-xl border border-white/10 rounded-[20px] p-8 md:p-12 shadow-[0_0_50px_rgba(4,185,202,0.1)] relative z-10"
            >
              {/* Hidden Web3Forms honeypot to prevent spam */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
              
              <div className="grid gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative group">
                    <input
                      className={`peer w-full bg-black/20 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 placeholder-transparent ${
                        touched.firstName && errors.firstName
                          ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                      }`}
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={e => handleChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      id="first-name"
                    />
                    <label
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                        touched.firstName && errors.firstName
                          ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                          : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                      }`}
                      htmlFor="first-name"
                    >
                      First Name *
                    </label>
                    {touched.firstName && errors.firstName && (
                      <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                        <span>⚠</span> {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="relative group">
                    <input
                      className={`peer w-full bg-black/20 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 placeholder-transparent ${
                        touched.lastName && errors.lastName
                          ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                      }`}
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={e => handleChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      id="last-name"
                    />
                    <label
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                        touched.lastName && errors.lastName
                          ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                          : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                      }`}
                      htmlFor="last-name"
                    >
                      Last Name *
                    </label>
                    {touched.lastName && errors.lastName && (
                      <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                        <span>⚠</span> {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative group">
                    <input
                      className={`peer w-full bg-black/20 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 placeholder-transparent ${
                        touched.email && errors.email
                          ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                      }`}
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      id="contact-email-main"
                    />
                    <label
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                        touched.email && errors.email
                          ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                          : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                      }`}
                      htmlFor="contact-email-main"
                    >
                      Email Address *
                    </label>
                    {touched.email && errors.email && (
                      <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                        <span>⚠</span> {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="relative group">
                    <input
                      className={`peer w-full bg-black/20 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 placeholder-transparent ${
                        touched.phone && errors.phone
                          ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                      }`}
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      id="contact-phone-main"
                    />
                    <label
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                        touched.phone && errors.phone
                          ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                          : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                      }`}
                      htmlFor="contact-phone-main"
                    >
                      Phone Number *
                    </label>
                    {touched.phone && errors.phone && (
                      <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                        <span>⚠</span> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative group">
                    <input
                      className="peer w-full bg-black/20 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 focus:border-cyan focus:bg-black/40 focus:ring-4 focus:ring-cyan/10 placeholder-transparent"
                      type="text"
                      name="company"
                      placeholder="Company"
                      value={form.company}
                      onChange={e => handleChange('company', e.target.value)}
                      id="company-name"
                    />
                    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-focus:text-cyan peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] peer-[:not(:placeholder-shown)]:text-cyan" htmlFor="company-name">
                      Your Company Name (Optional)
                    </label>
                  </div>
                  <div className="relative group">
                    <select
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white text-sm outline-none transition-all duration-300 focus:border-cyan focus:bg-black/40 focus:ring-4 focus:ring-cyan/10 appearance-none cursor-pointer"
                      name="service"
                      value={form.service}
                      onChange={e => handleChange('service', e.target.value)}
                      id="service-select"
                    >
                      <option value="" className="text-dark bg-white">Select a Service (Optional)</option>
                      {services.map(s => <option key={s} value={s} className="text-dark bg-white">{s}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    className={`peer w-full bg-black/20 border rounded-xl px-4 pt-8 pb-2 text-white text-sm outline-none transition-all duration-300 focus:bg-black/40 min-h-[120px] resize-y placeholder-transparent ${
                      touched.message && errors.message
                        ? 'border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-white/10 focus:border-cyan focus:ring-4 focus:ring-cyan/10'
                    }`}
                    name="message"
                    placeholder="Project Requirements"
                    rows={4}
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    id="project-message"
                  />
                  <label
                    className={`absolute left-4 top-6 -translate-y-1/2 text-sm transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] ${
                      touched.message && errors.message
                        ? 'text-rose-400 peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400'
                        : 'text-white/50 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:text-cyan'
                    }`}
                    htmlFor="project-message"
                  >
                    About Your Project Requirements *
                  </label>
                  {touched.message && errors.message && (
                    <p className="text-rose-400 text-xs mt-1.5 pl-1 flex items-center gap-1 font-mono">
                      <span>⚠</span> {errors.message}
                    </p>
                  )}
                </div>

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

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full p-4 rounded-xl font-display font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg group cursor-pointer
                    ${status === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' :
                    status === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' :
                    'bg-brand-gradient text-dark hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(4,185,202,0.4)]'}`}
                >
                  {status === 'idle' && (
                    <>
                      Send Message
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                  {status === 'loading' && (
                    <>
                      <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                      Sending...
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Message Sent!
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Failed — Try Again
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

     
      </section>

      <FAQ />
    </main>
  )
}
