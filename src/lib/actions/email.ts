'use server'

import { createClient } from '@/lib/supabase/server'

// Email service using Resend (or fallback to console log)
const RESEND_API_KEY = process.env.RESEND_API_KEY

interface SendEmailParams {
    to: string
    subject: string
    html: string
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
    if (!RESEND_API_KEY) {
        console.log('[Email] Resend API key not configured. Would send:')
        console.log(`  To: ${to}`)
        console.log(`  Subject: ${subject}`)
        return { success: true, mock: true }
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Wilcambidik Bruno <noreply@wilcambidik.bruno>',
                to: [to],
                subject,
                html,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('Resend API error:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error: 'Failed to send email' }
    }
}

export async function subscribeEmail(email: string) {
    const supabase = await createClient()

    // Generate verification token
    const verificationToken = crypto.randomUUID()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('email_subscribers')
            .upsert({
                email,
                verified: false,
                verification_token: verificationToken,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'email'
            })

        if (error) {
            console.error('Error saving email subscription:', error)
            return { success: false, error: error.message }
        }
    } catch (err) {
        console.error('Error saving email subscription:', err)
        return { success: false, error: 'Database error' }
    }

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portal-wilcambidik.vercel.app'}/api/verify-email?token=${verificationToken}`

    await sendEmail({
        to: email,
        subject: 'Verifikasi Langganan - Wilcambidik Bruno',
        html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333EA, #EC4899); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 28px;">📧</span>
                    </div>
                    <h1 style="color: #1F2937; margin: 0; font-size: 24px;">Wilcambidik Bruno</h1>
                    <p style="color: #6B7280; margin: 8px 0 0;">Portal Informasi Kedinasan</p>
                </div>
                
                <div style="background: #F9FAFB; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
                    <h2 style="color: #1F2937; margin: 0 0 16px; font-size: 20px;">Verifikasi Email Anda</h2>
                    <p style="color: #4B5563; margin: 0 0 24px; line-height: 1.6;">
                        Terima kasih telah berlangganan untuk menerima informasi terbaru dari Wilcambidik Bruno. 
                        Silakan klik tombol di bawah untuk memverifikasi email Anda.
                    </p>
                    <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #9333EA, #EC4899); color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600;">
                        Verifikasi Email
                    </a>
                </div>
                
                <p style="color: #9CA3AF; font-size: 14px; text-align: center;">
                    Jika Anda tidak merasa berlangganan, abaikan email ini.
                </p>
            </div>
        `,
    })

    return { success: true }
}

export async function verifyEmail(token: string) {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('email_subscribers')
            .update({ verified: true, verification_token: null })
            .eq('verification_token', token)
            .select()
            .single()

        if (error || !data) {
            return { success: false, error: 'Invalid or expired token' }
        }

        return { success: true, email: data.email }
    } catch {
        return { success: false, error: 'Invalid or expired token' }
    }
}

export async function unsubscribeEmail(email: string) {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('email_subscribers')
            .delete()
            .eq('email', email)

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch {
        return { success: false, error: 'Database error' }
    }
}

export async function sendNewPostNotification(title: string, excerpt: string, postUrl: string) {
    if (!RESEND_API_KEY) {
        console.log('[Email] Would send new post notification to all subscribers')
        return { success: true, mock: true }
    }

    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: subscribers, error } = await (supabase as any)
            .from('email_subscribers')
            .select('email')
            .eq('verified', true)

        if (error || !subscribers || subscribers.length === 0) {
            return { success: true, sent: 0 }
        }

        const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portal-wilcambidik.vercel.app'}${postUrl}`

        let successCount = 0

        // Send to all subscribers (in batches for production)
        for (const subscriber of subscribers) {
            const result = await sendEmail({
                to: subscriber.email,
                subject: `[Info Baru] ${title}`,
                html: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #1F2937; margin: 0; font-size: 24px;">Wilcambidik Bruno</h1>
                        </div>
                        
                        <div style="background: #F9FAFB; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
                            <h2 style="color: #1F2937; margin: 0 0 16px; font-size: 20px;">${title}</h2>
                            <p style="color: #4B5563; margin: 0 0 24px; line-height: 1.6;">
                                ${excerpt}
                            </p>
                            <a href="${fullUrl}" style="display: inline-block; background: linear-gradient(135deg, #9333EA, #EC4899); color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600;">
                                Baca Selengkapnya
                            </a>
                        </div>
                        
                        <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
                            Anda menerima email ini karena berlangganan update dari Wilcambidik Bruno.
                        </p>
                    </div>
                `,
            })

            if (result.success) successCount++
        }

        return { success: true, sent: successCount }
    } catch {
        return { success: true, sent: 0 }
    }
}

export async function getSubscriberCount() {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count, error } = await (supabase as any)
            .from('email_subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('verified', true)

        if (error) return 0
        return count || 0
    } catch {
        return 0
    }
}
