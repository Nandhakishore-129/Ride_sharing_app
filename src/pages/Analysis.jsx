import { ArrowRight, BadgeCheck, BellRing, CarFront, CircleDollarSign, Leaf, MapPinned, ShieldCheck, Users } from 'lucide-react'
import { useRides } from '../context/RideContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { places } from '../data/places.js'

const problems = [
  ['Empty seats', 'People travelling similar routes drive separately.', 'More traffic, fuel use and emissions.'],
  ['Inefficient matching', 'Many apps match endpoints, not route overlap.', 'Long detours and unreliable pickups.'],
  ['Unclear affordability', 'Solo fares and pooled pricing are hard to compare.', 'Higher cost per passenger.'],
  ['Safety and coordination', 'Trip status and rider hand-offs lack shared context.', 'More uncertainty before and during a ride.'],
]
const steps = ['Register', 'Publish route', 'Search', 'Smart match', 'Book + OTP', 'Live monitoring', 'Arrive + rate']
const safety = [
  [ShieldCheck, 'Verified profiles', 'Driver identity and community ratings build trust.'],
  [BadgeCheck, 'Trip OTP', 'A one-time code helps confirm the correct passenger and driver.'],
  [MapPinned, 'Live route', 'A visible trip route and progress keep riders informed.'],
  [BellRing, 'SOS + deviation alerts', 'Emergency contact messaging and a direct 112 call shortcut.'],
]
const roadmap = ['Real maps and live traffic routing', 'Backend with Node.js and a database', 'Hashed passwords, secure sessions and JWT', 'SMS emergency alerts and trip notifications', 'UPI payments and fare settlement', 'Multi-stop route matching', 'Driver identity verification', 'Women-only ride preferences']

export default function Analysis() {
  const { trips } = useRides()
  const { user } = useAuth()
  const complete = trips.filter((trip) => trip.status === 'Completed' && (trip.passengerId === user.id || trip.driverId === user.id))
  const km = complete.reduce((sum, trip) => sum + (trip.km || 0), 0)
  const savings = complete.reduce((sum, trip) => sum + (trip.savings || 0), 0)
  const co2 = km * 0.12
  const cityDaily = 10000 * 12 * 0.12
  return <div className="page-section analysis-page">
    <div className="page-heading"><div><p className="eyebrow">THE BIGGER PICTURE</p><h2>Why RideSync works</h2><p className="muted">A route-first approach to a more connected city.</p></div><span className="secure-label"><Leaf size={16} /> Mobility with impact</span></div>
    <section className="analysis-section glass-card"><div className="section-title-row"><div><span className="section-index">01</span><h3>The problem, in motion</h3></div><Users size={19} className="section-symbol" /></div>
      <div className="analysis-table-wrap"><table className="analysis-table"><thead><tr><th>Problem</th><th>Root cause</th><th>Effect</th></tr></thead><tbody>{problems.map(([problem, cause, effect]) => <tr key={problem}><td><strong>{problem}</strong></td><td>{cause}</td><td>{effect}</td></tr>)}</tbody></table></div>
    </section>
    <section className="analysis-section glass-card"><div className="section-title-row"><div><span className="section-index">02</span><h3>One journey, seven steps</h3></div><RouteIcon /></div>
      <div className="stepper">{steps.map((step, index) => <div className="step-item" key={step}><span className="step-number">{String(index + 1).padStart(2, '0')}</span><span>{step}</span>{index < steps.length - 1 && <ArrowRight size={14} className="step-arrow" />}</div>)}</div>
    </section>
    <section className="analysis-section"><div className="section-title-row analysis-section-title"><div><span className="section-index">03</span><h3>Transparent by design</h3><p className="muted">Readable formulas. No mystery multipliers.</p></div></div>
      <div className="formula-grid"><article className="formula-card glass-card"><span className="formula-icon blue-icon"><MapPinned size={18} /></span><h4>Route fit score</h4><code>max(40, round(100 − (pickupD + dropD) / 1.6 − ratingPenalty))</code><p>We project both passenger points onto the driver’s route. Closer pickups and drop-offs score higher. A small rating penalty applies below 4.6 stars.</p></article>
        <article className="formula-card glass-card"><span className="formula-icon green-icon"><CircleDollarSign size={18} /></span><h4>Shared ride fare</h4><code>max($20, round(km × ratePerKm / 2 + detourKm × 2))</code><p>Passengers share half the base route cost, plus a modest allowance for the extra distance to meet them.</p></article>
        <article className="formula-card glass-card"><span className="formula-icon amber-icon"><CarFront size={18} /></span><h4>Route eligibility</h4><code>pickupD ≤ 70 · dropD ≤ 70 · pickupT &lt; dropT · seats ≥ 1</code><p>Only same-direction trips with available seats and both stops within the route corridor are considered. Distances use the demo city scale.</p></article>
      </div>
    </section>
    <section className="analysis-section glass-card"><div className="section-title-row"><div><span className="section-index">04</span><h3>Safety is layered</h3></div><ShieldCheck size={19} className="section-symbol" /></div>
      <div className="safety-grid">{safety.map(([Icon, title, description]) => <article className="safety-item" key={title}><span className="safety-icon"><Icon size={18} /></span><div><h4>{title}</h4><p>{description}</p></div></article>)}</div>
      <p className="disclaimer">Prototype note: these interactions are demonstrations only; no real emergency message or live location is transmitted.</p>
    </section>
    <section className="analysis-section impact-section"><div className="section-title-row"><div><span className="section-index">05</span><h3>Small rides. Real impact.</h3><p className="muted">Illustrative estimates based on completed trips.</p></div><Leaf size={20} className="section-symbol" /></div>
      <div className="impact-grid"><article className="impact-card"><span>YOUR COMPLETED TRIPS</span><strong>{complete.length}</strong><small>community journeys shared</small></article><article className="impact-card"><span>YOUR ESTIMATED SAVINGS</span><strong>${Math.round(savings)}</strong><small>compared with solo cab fares</small></article><article className="impact-card"><span>CO₂ AVOIDED · ESTIMATE</span><strong>{co2.toFixed(1)} <small>kg</small></strong><small>based on {km.toFixed(1)} km at 0.12 kg/km</small></article><article className="impact-card city-impact"><span>ILLUSTRATIVE CITY · PER DAY</span><strong>{(cityDaily / 1000).toFixed(1)} <small>tonnes</small></strong><small>10,000 commuters × 12 km × 0.12 kg/km</small></article></div>
      <p className="muted tiny-note">These are simplified estimates for illustration, not audited emissions accounting.</p>
    </section>
    <section className="analysis-section glass-card"><div className="section-title-row"><div><span className="section-index">06</span><h3>RideSync vs. typical apps</h3></div></div>
      <div className="analysis-table-wrap"><table className="compare-table"><thead><tr><th>Capability</th><th>Typical app</th><th>RideSync prototype</th></tr></thead><tbody>{[['Route matching', 'Often endpoint-led', 'Projects stops onto shared route'], ['Pricing', 'May be opaque', 'Formula-based shared fare + savings'], ['Safety', 'Basic trip details', 'OTP, contact, SOS and deviation demo'], ['Coordination', 'Separate rider journeys', 'Shared route view and booking context']].map(([a, b, c]) => <tr key={a}><td><strong>{a}</strong></td><td>{b}</td><td><span className="compare-highlight">{c}</span></td></tr>)}</tbody></table></div>
    </section>
    <section className="analysis-section glass-card roadmap-section"><div className="section-title-row"><div><span className="section-index">07</span><h3>What comes next</h3><p className="muted">Prototype limitations and a practical roadmap.</p></div></div>
      <div className="roadmap-grid">{roadmap.map((item, index) => <div className="roadmap-item" key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div>
      <div className="limitations-note"><strong>Current limitations</strong><p>RideSync is a frontend-only prototype. Data is stored in this browser; routing and emissions are illustrative; alerts, payments, identity verification and actual GPS tracking are not connected to external services.</p></div>
    </section>
    <p className="tiny-note muted">Impact shown for {user.name}’s shared community trips. Matching places included: {places.length} city destinations.</p>
  </div>
}

function RouteIcon() { return <ArrowRight size={19} className="section-symbol" /> }
