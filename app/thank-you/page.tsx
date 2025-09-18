'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Phone, Clock } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl mx-auto shadow-xl">
                <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-20 w-20 text-green-500" />
                    </div>
                    <CardTitle className="text-3xl font-bold mb-2">
                        Thank You for Your Submission!
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        Your Driver&apos;s License verification request has been successfully submitted.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
                        <ul className="space-y-2 text-green-700">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>We&apos;ve sent a confirmation email with your submission details</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Our team will review your documents within 24-48 hours</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>We&apos;ll contact you if we need any additional information</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">Important Notes:</h3>
                        <ul className="space-y-1 text-blue-700 text-sm">
                            <li>• Please keep your submitted documents secure</li>
                            <li>• Do not share your verification details with unauthorized parties</li>
                            <li>• You can contact us if you have any questions about your submission</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button asChild className="flex-1">
                            <Link href="/services">
                                Submit Another Application
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                            <Link href="/contact">
                                Contact Support
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center pt-4">
                        <Button asChild variant="ghost">
                            <Link href="/">
                                ← Back to Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
