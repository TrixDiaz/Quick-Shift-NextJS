"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
    const [ formData, setFormData ] = useState({
        name: "",
        email: "",
        message: "",
    })
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [ e.target.name ]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await axios.post('/api/contact', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            toast.success('Message sent successfully!', {
                description: 'We\'ll get back to you soon.',
                duration: 5000,
            })
            setFormData({ name: "", email: "", message: "" })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.'
                toast.error(errorMessage, {
                    duration: 5000,
                })
            } else {
                toast.error('Network error', {
                    duration: 5000,
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="py-20 bg-muted/30">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Contact Form */}
                    <Card className="shadow-xl border border-border">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Write your message..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Right Side - Map */}
                    <div className="rounded-xl overflow-hidden shadow-lg h-[400px] lg:h-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2798854093!2d-74.2598736877829!3d40.69767006390443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xa6f0b3f6e4f6d9e7!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sph!4v1676379268942!5m2!1sen!2sph"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}
