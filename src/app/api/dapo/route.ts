import { NextRequest, NextResponse } from 'next/server'

// Cache data for 1 hour
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in ms

interface CacheEntry {
    data: unknown
    timestamp: number
}

const cache: Map<string, CacheEntry> = new Map()

// DAPO API endpoints
const DAPO_BASE_URL = 'https://dapo.kemendikdasmen.go.id'

// Kode wilayah Jawa Tengah
const KODE_JATENG = '030000'
const SEMESTER_ID = '20242'

async function fetchDapoData(endpoint: string) {
    const cacheKey = endpoint
    const cached = cache.get(cacheKey)

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
    }

    try {
        const response = await fetch(`${DAPO_BASE_URL}${endpoint}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Portal-Wilcambidik/1.0',
            },
            next: { revalidate: 3600 }, // Next.js cache for 1 hour
        })

        if (!response.ok) {
            throw new Error(`DAPO API error: ${response.status}`)
        }

        const data = await response.json()

        // Update cache
        cache.set(cacheKey, { data, timestamp: Date.now() })

        return data
    } catch (error) {
        console.error('Error fetching DAPO data:', error)
        // Return cached data if available, even if expired
        if (cached) {
            return cached.data
        }
        throw error
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'sekolah'

    try {
        let endpoint = ''

        switch (type) {
            case 'sekolah':
                // Get school data for Jawa Tengah province
                endpoint = `/rekap/dataSekolah?id_level_wilayah=1&kode_wilayah=000000&semester_id=${SEMESTER_ID}`
                break
            case 'pd':
                // Get student data
                endpoint = `/rekap/dataPD?id_level_wilayah=1&kode_wilayah=000000&semester_id=${SEMESTER_ID}`
                break
            case 'ptk':
                // Get teacher data
                endpoint = `/rekap/dataPTK?id_level_wilayah=1&kode_wilayah=000000&semester_id=${SEMESTER_ID}`
                break
            case 'jateng':
                // Get Jawa Tengah specific data (kabupaten level)
                endpoint = `/rekap/dataSekolah?id_level_wilayah=1&kode_wilayah=${KODE_JATENG}&semester_id=${SEMESTER_ID}`
                break
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        const data = await fetchDapoData(endpoint)

        // Filter for Jawa Tengah if needed
        let filteredData = data
        if (type === 'sekolah' || type === 'pd' || type === 'ptk') {
            if (Array.isArray(data)) {
                filteredData = data.find((item: { kode_wilayah?: string }) =>
                    item.kode_wilayah?.trim() === KODE_JATENG
                ) || data.find((item: { nama?: string }) =>
                    item.nama?.includes('Jawa Tengah')
                )
            }
        }

        return NextResponse.json({
            success: true,
            data: filteredData,
            source: 'DAPO Kemendikdasmen',
            lastUpdated: new Date().toISOString(),
            semester: SEMESTER_ID,
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch data from DAPO' },
            { status: 500 }
        )
    }
}
