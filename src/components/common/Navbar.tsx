import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '../../assets/1.png'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Services', path: '/services', mega: true, sub: [
      { label: 'Search Engine Optimization', path: '/services/search-engine-optimization', desc: 'Rank higher, get found, grow organically' },
      { label: 'Social Media Marketing', path: '/services/social-media-marketing', desc: 'Build community and drive engagement' },
      { label: 'Pay-Per-Click (PPC)', path: '/services/pay-per-click-ppc', desc: 'Instant visibility with targeted ads' },
      { label: 'Meta Ads', path: '/services/meta-ads', desc: 'Facebook & Instagram ad campaigns' },
      { label: 'LinkedIn Marketing', path: '/services/linkedin-marketing', desc: 'B2B lead generation and brand authority' },
    ]
  },
  { label: 'Projects', path: '/projects' },
  { label: 'Insights', path: '/insights' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const lastScrollY = useRef(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      setHidden(y > lastScrollY.current && y > 200)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const isBlocked = (label: string) => {
    return label !== 'Home' && label !== 'Contact';
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] 
          ${hidden ? '-translate-y-full' : 'translate-y-0'} 
          ${scrolled ? 'bg-black/70 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center shrink-0"
          >
            <img
              src={logoImg}
              alt="DWC Logo"
              className={`w-auto object-contain transition-all duration-400 ${scrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.mega ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    to="/services"
                    onClick={(e) => {
                      if (isBlocked(link.label)) {
                        e.preventDefault();
                      }
                    }}
                    className={`font-body font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5
                      ${isBlocked(link.label) 
                        ? 'cursor-not-allowed text-white/40' 
                        : (location.pathname.startsWith('/services') ? 'text-primary' : 'text-white/85 hover:bg-white/5')}`}
                  >
                    {link.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? 'rotate-180' : 'rotate-0'}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </Link>

                  {/* Mega Dropdown */}
                  <div className={`absolute top-full left-0 w-[600px] bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-2xl p-8 transition-all duration-300 border border-white/10 overflow-hidden
                    ${megaOpen ? 'opacity-100 visible translate-y-2' : 'opacity-0 invisible translate-y-6'}`}
                  >
                    {/* Glowing radial backdrop inside dropdown */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-cyan/5 to-transparent pointer-events-none rounded-2xl" />

                    <div className="mb-4 pb-4 border-b border-white/5 relative z-10">
                      <span className="font-mono text-[0.7rem] text-cyan tracking-[0.15em] uppercase font-bold">Our Services</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 relative z-10">
                      {link.sub?.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={(e) => e.preventDefault()}
                          className="p-4 rounded-xl no-underline transition-all duration-300 border border-transparent cursor-not-allowed opacity-50 group/item"
                        >
                          <div className="text-white font-display font-semibold text-sm mb-1 flex items-center gap-1.5">
                            {sub.label}
                          </div>
                          <div className="text-zinc-400 text-[0.78rem] leading-relaxed">{sub.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    if (isBlocked(link.label)) {
                      e.preventDefault();
                    }
                  }}
                  className={`font-body font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200
                    ${isBlocked(link.label) 
                      ? 'cursor-not-allowed text-white/40' 
                      : (location.pathname === link.path ? 'text-primary font-semibold' : 'text-white/85 hover:bg-white/5')}`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex">
            <Link
              to="/contact"
              data-cursor="button"
              className="bg-brand-gradient text-dark font-display font-semibold text-[0.875rem] px-6 py-2.5 rounded-full no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(13,94,246,0.5)] shadow-[0_4px_20px_rgba(13,94,246,0.35)] cursor-pointer"
            >
              Get Free Consultation
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex lg:hidden bg-transparent border-none p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-[5px]">
              <span className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-1'}`} />
              <span className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/98 backdrop-blur-xl z-[9980] flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] 
          ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        {/* Soft floating background visual aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="flex flex-col items-center gap-6 relative z-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.path || link.label}
              to={link.path || '/services'}
              onClick={(e) => {
                if (isBlocked(link.label)) {
                  e.preventDefault();
                } else {
                  setMobileOpen(false);
                }
              }}
              className={`no-underline font-display font-bold text-[clamp(1.8rem,6vw,2.8rem)] transition-all duration-400
                ${isBlocked(link.label) ? 'cursor-not-allowed text-white/30' : (location.pathname === link.path ? 'text-primary' : 'text-white hover:text-primary')}
                ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className={`mt-6 bg-brand-gradient text-dark font-display font-bold px-8 py-3.5 rounded-full no-underline transition-all duration-400 hover:scale-105 active:scale-95 cursor-pointer
              ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: `${navLinks.length * 0.05}s` }}
          >
            Get Free Consultation
          </Link>
        </div>
      </div>
    </>
  )
}
