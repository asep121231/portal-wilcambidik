import { NextRequest, NextResponse } from 'next/server'
import { verifyEmail } from '@/lib/actions/email'

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(new URL('/?error=invalid_token', request.url))
    }

    const result = await verifyEmail(token)

    if (!result.success) {
        return NextResponse.redirect(new URL('/?error=verification_failed', request.url))
    }

    return NextResponse.redirect(new URL('/?verified=true', request.url))
}
