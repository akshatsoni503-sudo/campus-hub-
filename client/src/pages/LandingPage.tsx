import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Bot, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-6">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Exclusive platform for verified students.</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17105F] leading-tight mb-6">
              Everything Happening on Your Campus. <span className="text-[#1769E0]">In One Place.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Discover events. Find opportunities. Build teams. Grow your skills.
            </p>
            <Link to="/register">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>Get Started</Button>
            </Link>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="w-96 h-80 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 border-2 border-[#17105F] rounded-xl rotate-45 opacity-30" />
                <div className="absolute inset-2 border-2 border-[#1769E0] rounded-xl rotate-[22deg] opacity-50" />
                <div className="absolute inset-4 border-2 border-[#17105F] rounded-xl opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#17105F]">CH</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">CAMPUS <span className="font-extrabold text-[#17105F]">HUB</span></h2>
              <p className="text-sm text-gray-500 mt-2">Your college ecosystem</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'Discover Campus Events', desc: 'Never miss out. AI Match ensures you only see events relevant to your major and interests.', color: 'bg-blue-50 text-[#1769E0]' },
            { icon: Users, title: 'Find Hackathons & Build Your Team', desc: 'Connect with designers, developers, and visionaries. Build projects that matter.', color: 'bg-purple-50 text-purple-600' },
            { icon: Bot, title: 'AI Campus Copilot', desc: 'Your personal assistant for navigating campus life. Supports Hinglish & English natively.', color: 'bg-indigo-50 text-indigo-600' },
          ].map((f, i) => (
            <Card key={i} hover padding="lg" className="group">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17105F] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              {i === 2 && (
                <div className="mt-4 space-y-2">
                  <div className="bg-[#F5F3FF] px-3 py-2 rounded-lg text-xs text-gray-600 border border-[#E9E5FF]">
                    "Library me study room book kar do 2 baje."
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-lg text-xs text-green-700 border border-green-100">
                    Done! Study Room B is booked for you at 2 PM.
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#17105F] py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to explore your campus?</h2>
          <p className="text-gray-300 mb-8">Join thousands of verified students already using Campus Hub.</p>
          <Link to="/register"><Button variant="outline" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-[#17105F]">Create Your Account <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2026 Campus Hub. Built for students, by students.
        </div>
      </footer>
    </div>
  );
}
