import { CarFront, CircleDollarSign, Leaf, ShieldCheck } from 'lucide-react'

export function AuthHero() {
  return <aside className="auth-hero"><div className="auth-orb" /><div className="auth-hero-content"><div className="brand auth-brand"><span className="brand-mark"><CarFront size={20} /></span><span>Ride<span className="brand-accent">Sync</span></span></div><div className="auth-headline"><p className="eyebrow">THE SMARTER WAY TO MOVE</p><h1>Share the ride.<br /><span>Save the planet.</span></h1><p>Better routes. Smaller fares. A city that breathes easier.</p></div><ul className="benefit-list"><li><span><CircleDollarSign size={17} /></span>Save more with every shared seat</li><li><span><ShieldCheck size={17} /></span>Safety built into every journey</li><li><span><Leaf size={17} /></span>Make a lighter footprint together</li></ul><div className="auth-map-art"><span /><span /><span /><span /><i>↗</i></div></div></aside>
}
