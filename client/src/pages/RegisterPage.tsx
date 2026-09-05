import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, GraduationCap, Briefcase, Upload, Shield, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import Input from '../components/ui/Input';
import { TextArea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';

const SKILLS = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AI/ML', 'Data Science', 'Java', 'C++', 'Flutter', 'UI/UX Design', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Blockchain', 'Web Development', 'Mobile Development', 'Database Management'];
const INTERESTS = ['Hackathons', 'Web Development', 'AI/ML', 'Data Science', 'Open Source', 'Competitive Programming', 'App Development', 'Robotics', 'Entrepreneurship', 'Gaming', 'Cybersecurity', 'Cloud Computing'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<'STUDENT' | 'EVENT_MANAGER' | ''>('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', college: '', branch: '', year: '', studentId: '', organizationName: '', phone: '' });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [collegeIdFile, setCollegeIdFile] = useState<File | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const steps = ['Basic Info', 'Skills & Interests', 'Verification', 'Email Verify'];

  const toggleSkill = (s: string) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleInterest = (i: string) => setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleRegister = async () => {
    setLoading(true); setError('');
    try {
      const data = { ...form, role, skills: selectedSkills, interests: selectedInterests };
      await register(data);
      showToast('Account created! Please verify your email.', 'success');
      setStep(4);
    } catch (err: any) { setError(err.response?.data?.error || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const handleUploadId = async () => {
    if (!collegeIdFile) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('collegeId', collegeIdFile);
      await authAPI.uploadCollegeId(fd);
      showToast('Document uploaded successfully!', 'success');
    } catch (err: any) { showToast('Upload failed', 'error'); }
    finally { setLoading(false); }
  };

  const handleVerifyEmail = async () => {
    setLoading(true); setError('');
    try {
      await authAPI.verifyEmail({ otp });
      const res = await authAPI.getMe();
      updateUser(res.data);
      showToast('Email verified! Welcome to Campus Hub!', 'success');
      navigate('/dashboard');
    } catch (err: any) { setError(err.response?.data?.error || 'Invalid OTP'); }
    finally { setLoading(false); }
  };

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.college || !form.branch || !form.year) { setError('Please fill in all required fields'); return false; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return false; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    setError(''); return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#17105F] rounded-xl flex items-center justify-center"><span className="text-white font-bold">CH</span></div>
            <span className="text-2xl font-bold text-[#17105F]">Campus Hub</span>
          </Link>
        </div>

        {/* Progress */}
        {step > 0 && (
          <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 < step ? 'bg-[#17105F] text-white' : i + 1 === step ? 'bg-[#17105F] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i + 1 < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-16 sm:w-24 h-0.5 mx-1 ${i + 1 < step ? 'bg-[#17105F]' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

          {/* Step 0: Role */}
          {step === 0 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#17105F] mb-2">Create Your Account</h2>
              <p className="text-gray-500 mb-8">What are you registering as?</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { r: 'STUDENT' as const, icon: GraduationCap, title: 'Student', desc: 'Discover events, join teams, and build your campus profile.' },
                  { r: 'EVENT_MANAGER' as const, icon: Briefcase, title: 'Event Manager', desc: 'Publish events, manage registrations, and grow your club.' },
                ].map(item => (
                  <button key={item.r} onClick={() => { setRole(item.r); setStep(1); }}
                    className="p-6 border-2 rounded-2xl text-left hover:border-[#17105F] hover:bg-[#F5F3FF] transition-all group">
                    <item.icon className="w-10 h-10 text-[#17105F] mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-[#17105F]">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-sm text-gray-500">Already have an account? <Link to="/login" className="text-[#1769E0] font-semibold hover:underline">Sign In</Link></p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-[#17105F] mb-6">Basic Information</h2>
              <div className="space-y-4">
                <Input label="Full Name *" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <Input label="Email *" type="email" placeholder="you@college.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Password *" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  <Input label="Confirm Password *" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
                </div>
                <Input label="College Name *" placeholder="e.g. IIT Delhi" value={form.college} onChange={e => setForm({...form, college: e.target.value})} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Branch / Department *" placeholder="e.g. Computer Science" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} />
                  <Input label="Year *" placeholder="e.g. 3rd Year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
                </div>
                {role === 'EVENT_MANAGER' && (
                  <>
                    <Input label="Organization / Club Name" placeholder="e.g. Tech Club" value={form.organizationName} onChange={e => setForm({...form, organizationName: e.target.value})} />
                    <Input label="Phone" placeholder="Optional" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </>
                )}
                {role === 'STUDENT' && (
                  <Input label="Student ID (Optional)" placeholder="e.g. CS2024001" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
                )}
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(0)} icon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button onClick={() => validateStep1() && setStep(2)} icon={<ArrowRight className="w-4 h-4" />}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Interests */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-[#17105F] mb-2">Skills & Interests</h2>
              <p className="text-sm text-gray-500 mb-6">Select your skills and interests for personalized recommendations.</p>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map(s => (
                    <button key={s} onClick={() => toggleSkill(s)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedSkills.includes(s) ? 'bg-[#17105F] text-white' : 'bg-[#F5F3FF] text-[#17105F] hover:bg-[#EDE9FE]'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedInterests.includes(i) ? 'bg-[#1769E0] text-white' : 'bg-blue-50 text-[#1769E0] hover:bg-blue-100'}`}>{i}</button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 3: Verification - matching screenshot */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-14 h-14 bg-[#17105F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#17105F] mb-2">{role === 'STUDENT' ? 'Student' : 'Manager'} Verification</h2>
              <p className="text-gray-500 text-sm mb-8">Verification is required to access the main platform.</p>

              <div className="text-left">
                <FileUpload label="Upload College ID Card / Admission Letter" onFileSelect={f => setCollegeIdFile(f)} />
                
                <div className="mt-6">
                  <Input label="Student ID Number (Optional)" placeholder="e.g. 123456789" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Lock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">Your documents are stored securely and visible only to admins. They will be automatically deleted from our servers once verification is complete.</p>
                </div>

                <div className="mt-8 space-y-3">
                  <Button fullWidth loading={loading} onClick={async () => { await handleRegister(); if (collegeIdFile) await handleUploadId(); }} icon={<ArrowRight className="w-4 h-4" />}>Submit for Verification</Button>
                  <Button fullWidth variant="outline" onClick={() => handleRegister()}>Save as Draft & Exit</Button>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="ghost" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
              </div>
            </div>
          )}

          {/* Step 4: Email OTP */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#17105F] mb-2">Verify Your Email</h2>
              <p className="text-gray-500 text-sm mb-8">Enter the verification code sent to <strong>{form.email}</strong></p>

              <div className="max-w-xs mx-auto">
                <Input placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} className="text-center text-2xl tracking-widest" maxLength={6} />
                <Button fullWidth loading={loading} onClick={handleVerifyEmail} className="mt-4">Verify Email</Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-blue-700">💡 Demo OTP: <strong>123456</strong></p>
              </div>

              <button onClick={() => navigate('/dashboard')} className="mt-4 text-sm text-gray-500 hover:text-[#1769E0]">Skip for now →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
