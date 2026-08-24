import { useRef } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/1.png'
import VariableProximity from '../ui/VariableProximity'

const services = [
  { label: 'Search Engine Optimization', path: '/services/search-engine-optimization' },
  { label: 'Social Media Marketing', path: '/services/social-media-marketing' },
  { label: 'Pay-Per-Click (PPC)', path: '/services/pay-per-click-ppc' },
  { label: 'Meta Ads', path: '/services/meta-ads' },
  { label: 'LinkedIn Marketing', path: '/services/linkedin-marketing' },
]
const company = [
  { label: 'Our Team', path: '/about#team' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
]

const socials = [
  {
    label: 'LinkedIn', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
    ), href: 'https://in.linkedin.com/company/digitalwebconnection'
  },
  {
    label: 'Instagram', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
    ), href: 'https://www.instagram.com/digitalwebconnection/'
  },
  {
    label: 'Facebook', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
    ), href: 'https://www.facebook.com/p/Digitalwebconnection-100092036863467/'
  },
  {
    label: 'Twitter', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v11A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
    ), href: 'https://x.com/Digiwebconnect'
  },
]

export default function Footer() {
  const containerRef = useRef(null);

  return (
    <footer className="bg-black relative overflow-hidden border-t border-white noise-overlay">
      {/* Big display text */}
      <div className="pt-12 px-8 text-center overflow-hidden no-splash">
        <div ref={containerRef} style={{ position: 'relative' }} className="font-display font-bold text-[clamp(2.5rem,8vw,7rem)] leading-none text-white/60 [text-stroke:1px_rgba(255,255,255,0.15)] tracking-tighter opacity-80 uppercase cursor-default no-splash">
          <VariableProximity
            label="HELLO! WE'RE LISTENING"
            className="variable-proximity-demo"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={100}
            falloff="linear"
          />
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 no-underline mb-5 group">
              <img src={logoImg} alt="DWC Logo" className="h-11 w-auto object-contain transition-transform group-hover:scale-105" />

            </Link>
            <p className="text-white text-sm leading-relaxed mb-6 max-w-[280px]">
              AI-Driven Digital Marketing Agency in Ahmedabad. Helping brands grow with strategy, creativity, and research.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white border border-primary flex items-center justify-center text-dark/60 transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:border-primary hover:rotate-[10deg]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-base">Services</h4>
            <ul className="list-none flex flex-col gap-3">
              {services.map(s => (
                <li key={s.path}>
                  <Link 
                    to={s.path} 
                    onClick={(e) => e.preventDefault()}
                    className="text-white/40 no-underline text-sm cursor-not-allowed"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-base">Company</h4>
            <ul className="list-none flex flex-col gap-3">
              {company.map(c => (
                <li key={c.path}>
                  <Link 
                    to={c.path} 
                    onClick={(e) => {
                      if (c.path !== '/contact') {
                        e.preventDefault()
                      }
                    }}
                    className={`no-underline text-sm transition-colors ${
                      c.path === '/contact' ? 'text-white/70 hover:text-primary cursor-pointer' : 'text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-base">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:service@digitalwebconnection.com" className="text-white/60 no-underline text-sm transition-colors hover:text-primary break-all">
                service@digitalwebconnection.com
              </a>
              <a href="tel:+919998204044" className="text-white/60 no-underline text-sm transition-colors hover:text-primary">
                +91 99982 04044
              </a>
              <a
                href="https://maps.google.com/?q=B-1103,+Titanium+City+Center,+Prahladnagar,+Ahmedabad,+Gujarat,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 no-underline text-sm transition-colors hover:text-primary"
              >
                B-1103, Titanium City Center, Prahladnagar, Ahmedabad, Gujarat, India
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-8 py-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center items-center gap-4">
          <p className="text-white text-[0.75rem] font-mono">
            © 2026 Digital Web Connection. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
