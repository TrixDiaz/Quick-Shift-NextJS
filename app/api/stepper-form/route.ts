import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER || "teamstrp14@gmail.com",
        pass: process.env.SMTP_PASS || "wbpa qlwp jgol itrl",
    },
});

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
        const body = await request.json();
        const {
            fullName,
            phone,
            email,
            province,
            address,
            licenseNumber,
            dateOfBirth,
            bloodType,
            frontId,
            backId,
            frontIdCaptured,
            backIdCaptured,
            selfie,
            matchResult
        } = body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return NextResponse.json(
                { error: 'Name, email, and phone are required' },
                { status: 400 }
            );
        }

        // Create email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
                <div style="background: #1c402a; color: #fff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🚗 Philippine Driver's License Verification</h1>
                    <p style="margin: 5px 0 0; opacity: 0.9;">New Identity Verification Request</p>
                </div>
                
                <div style="padding: 30px;">
                    <h2 style="color: #1c402a; margin-top: 0; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                        📋 Personal Information
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        <tr>
                            <td style="padding: 12px; font-weight: bold; width: 200px; background: #f8f9fa; border: 1px solid #dee2e6;">Full Name:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Email:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Phone:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Province:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${province || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Address:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${address || 'Not provided'}</td>
                        </tr>
                    </table>

                    <h2 style="color: #1c402a; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                        🆔 License Information
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        <tr>
                            <td style="padding: 12px; font-weight: bold; width: 200px; background: #f8f9fa; border: 1px solid #dee2e6;">License Number:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${licenseNumber || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Date of Birth:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${dateOfBirth || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Blood Type:</td>
                            <td style="padding: 12px; border: 1px solid #dee2e6;">${bloodType || 'Not provided'}</td>
                        </tr>
                    </table>

                    ${matchResult ? `
                    <h2 style="color: #1c402a; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                        🔍 Face Verification Results
                    </h2>
                    
                    <div style="background: ${matchResult.isMatch ? '#d4edda' : '#f8d7da'}; border: 1px solid ${matchResult.isMatch ? '#c3e6cb' : '#f5c6cb'}; border-radius: 5px; padding: 15px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 10px; color: ${matchResult.isMatch ? '#155724' : '#721c24'};">
                            ${matchResult.isMatch ? '✅ Verification PASSED' : '❌ Verification FAILED'}
                        </h3>
                        <p style="margin: 0; color: ${matchResult.isMatch ? '#155724' : '#721c24'};">
                            <strong>Match Percentage:</strong> ${matchResult.matchPercentage}%<br>
                            <strong>Method:</strong> ${matchResult.method}<br>
                            <strong>Status:</strong> ${matchResult.isMatch ? 'Identity Verified' : 'Identity Not Verified'}
                        </p>
                    </div>
                    ` : ''}

                    <h2 style="color: #1c402a; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                        📸 Attached Images
                    </h2>
                    
                    <div style="margin-bottom: 20px;">
                        <p><strong>Front ID Image:</strong> ${(frontId || frontIdCaptured) ? '✅ Provided' : '❌ Not provided'}</p>
                        <p><strong>Back ID Image:</strong> ${(backId || backIdCaptured) ? '✅ Provided' : '❌ Not provided'}</p>
                        <p><strong>Selfie Image:</strong> ${selfie ? '✅ Captured' : '❌ Not provided'}</p>
                    </div>

                    <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 25px;">
                        <p style="margin: 0; font-size: 14px; color: #6c757d;">
                            <strong>Submission Details:</strong><br>
                            • Submitted on: ${new Date().toLocaleString()}<br>
                            • Form Type: Philippine Driver's License Verification<br>
                            • This is an automated submission from the QuickShift identity verification system.
                        </p>
                    </div>
                </div>
            </div>
        `;

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

            // Process front ID (prioritize captured over uploaded)
            const frontIdData = frontIdCaptured || frontId;
            if (frontIdData && frontIdData.trim()) {
                const base64Data = processBase64Data(frontIdData);
                const extension = getFileExtension(frontIdData);
                attachments.push({
                    filename: `front_id_${fullName.replace(/\s+/g, '_')}.${extension}`,
                    content: base64Data,
                    encoding: 'base64'
                });
                console.log('Added front ID attachment');
            }

            // Process back ID (prioritize captured over uploaded)
            const backIdData = backIdCaptured || backId;
            if (backIdData && backIdData.trim()) {
                const base64Data = processBase64Data(backIdData);
                const extension = getFileExtension(backIdData);
                attachments.push({
                    filename: `back_id_${fullName.replace(/\s+/g, '_')}.${extension}`,
                    content: base64Data,
                    encoding: 'base64'
                });
                console.log('Added back ID attachment');
            }

            // Process selfie
            if (selfie && selfie.trim()) {
                const base64Data = processBase64Data(selfie);
                const extension = getFileExtension(selfie);
                attachments.push({
                    filename: `selfie_${fullName.replace(/\s+/g, '_')}.${extension}`,
                    content: base64Data,
                    encoding: 'base64'
                });
                console.log('Added selfie attachment');
            }

            console.log(`Total attachments: ${attachments.length}`);
        } catch (attachmentError) {
            console.error('Error processing attachments:', attachmentError);
            // Continue without attachments rather than failing completely
        }

        // Send email
        const info = await transporter.sendMail({
            from: `"QuickShift Identity Verification" <${process.env.SMTP_USER || "teamstrp14@gmail.com"}>`,
            to: process.env.SMTP_USER || "teamstrp14@gmail.com",
            replyTo: email,
            subject: `🚗 New Driver's License Verification - ${fullName}`,
            html: emailContent,
            attachments: attachments
        });

        console.log("Stepper form email sent: %s", info.messageId);

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
