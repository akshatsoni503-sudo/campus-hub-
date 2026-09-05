import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#17105F] rounded-xl flex items-center justify-center"><span className="text-white font-bold">CH</span></div>
            <span className="text-2xl font-bold text-[#17105F]">Campus Hub</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#17105F]">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@college.edu" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} />
            <Button type="submit" fullWidth loading={loading}>Sign In</Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-[#1769E0] font-semibold hover:underline">Register</Link></p>
          </div>

          <div className="mt-6 p-4 bg-[#F5F3FF] rounded-xl">
            <p className="text-xs font-semibold text-[#17105F] mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Student: rahul@college.edu / Student@123</p>
              <p>Manager: priya@college.edu / Manager@123</p>
              <p>Admin: admin@campushub.com / Admin@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
