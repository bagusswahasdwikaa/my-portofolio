import { useState } from 'react'
import { supabase, isSupabaseConfigured } from "../supabase";
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, Sparkles, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!isSupabaseConfigured) {
      Swal.fire({
        icon: 'warning',
        title: 'Supabase Belum Dikonfigurasi',
        html: `File <code>.env</code> Anda masih berisi placeholder.<br/><br/>
        Silakan buka file <b>.env</b> di editor dan isi nilai asli:<br/>
        <code class="text-xs bg-black/40 p-1 rounded block mt-2">VITE_SUPABASE_URL=https://...<br/>VITE_SUPABASE_ANON_KEY=eyJhb...</code><br/>
        Lalu restart dev server agar perubahan terbaca.`,
        background: '#ffffff',
        color: '#0f172a',
        confirmButtonColor: '#315f8a',
      });
      return;
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: error.message || 'Email atau password salah. Silakan coba lagi.',
          background: '#ffffff',
          color: '#0f172a',
          confirmButtonColor: '#315f8a',
        });
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        Swal.fire({
          icon: 'error',
          title: 'Akses Ditolak',
          text: 'Akun ini bukan administrator (role !== admin). Pastikan Anda telah menjalankan query INSERT profiles untuk user ini.',
          background: '#ffffff',
          color: '#0f172a',
          confirmButtonColor: '#315f8a',
        });
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Selamat datang di Dashboard Admin!',
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#0f172a',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error("Login exception:", err);
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        html: `Gagal menghubungi server Supabase.<br/><br/><span class="text-xs text-red-300">${err.message || 'Network error'}</span><br/><br/>Pastikan <b>VITE_SUPABASE_URL</b> di file <b>.env</b> sudah diisi dengan benar dan dev server sudah di-restart.`,
        background: '#ffffff',
        color: '#0f172a',
        confirmButtonColor: '#315f8a',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-700" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-8 space-y-7">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300 text-xs font-medium">Admin Portal</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to manage your portfolio</p>
            </div>

            {/* Warning if Supabase is not configured yet */}
            {!isSupabaseConfigured && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-300 text-xs leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-200">Supabase Belum Dikonfigurasi</p>
                  <p className="text-amber-300/80 mt-0.5">
                    Harap isi <span className="font-mono text-white">VITE_SUPABASE_URL</span> &amp; <span className="font-mono text-white">VITE_SUPABASE_ANON_KEY</span> di file <span className="underline font-semibold">.env</span> untuk mengaktifkan login.
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Email</label>
                <div className="flex items-center bg-white/8 border border-white/15 rounded-xl overflow-hidden focus-within:border-indigo-500/60 transition-colors">
                  <Mail className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Password</label>
                <div className="flex items-center bg-white/8 border border-white/15 rounded-xl overflow-hidden focus-within:border-indigo-500/60 transition-colors">
                  <Lock className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="mr-4 shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="relative group/btn w-full mt-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-70 blur group-hover/btn:opacity-100 transition duration-300" />
                <div className="relative h-11 bg-[#030014] rounded-xl border border-white/10 flex items-center justify-center gap-2 overflow-hidden">
                  <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20" />
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative text-sm font-medium text-white">Sign In</span>
                      <LogIn className="relative w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}