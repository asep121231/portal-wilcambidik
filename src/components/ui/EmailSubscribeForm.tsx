'use client'

import { useState } from 'react'
import { subscribeEmail } from '@/lib/actions/email'

export default function EmailSubscribeForm() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !email.includes('@')) {
            setStatus('error')
            setMessage('Masukkan email yang valid')
            return
        }

        setIsLoading(true)
        setStatus('idle')

        try {
            const result = await subscribeEmail(email)

            if (result.success) {
                setStatus('success')
                setMessage('Berhasil! Cek email untuk verifikasi.')
                setEmail('')
            } else {
                setStatus('error')
                setMessage(result.error || 'Gagal berlangganan')
            }
        } catch {
            setStatus('error')
            setMessage('Terjadi kesalahan')
        }

        setIsLoading(false)
    }

    return (
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Langganan Info Terbaru</h3>
                    <p className="text-white/80 text-sm">Dapatkan notifikasi via email</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/20 placeholder-white/60 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        'Daftar'
                    )}
                </button>
            </form>

            {status !== 'idle' && (
                <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
