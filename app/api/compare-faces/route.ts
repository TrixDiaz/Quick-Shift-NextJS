import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_BASE_URL = 'http://72.60.195.25';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.id_image || !body.live_image) {
            return NextResponse.json(
                { error: 'Both id_image and live_image are required' },
                { status: 400 }
            );
        }

        // Forward the request to FastAPI backend
        const response = await fetch(`${FASTAPI_BASE_URL}/api/compare-faces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_image: body.id_image,
                live_image: body.live_image
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            return NextResponse.json(
                { error: errorData.error || `FastAPI Error: ${response.status}` },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        console.error('Compare faces API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process face comparison',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        {
            message: 'Compare faces API endpoint is working',
            timestamp: new Date().toISOString(),
            status: 'active'
        },
        { status: 200 }
    );
}
