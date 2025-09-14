"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Upload, Camera, User, FileText, Eye, X } from "lucide-react"
import Image from "next/image"

const steps = [
    {
        id: 1,
        title: "Personal Information",
        description: "Please provide your personal details",
        icon: User
    },
    {
        id: 2,
        title: "ID Upload",
        description: "Upload front and back of your ID",
        icon: Upload
    },
    {
        id: 3,
        title: "Photo Verification",
        description: "Take a selfie for verification and capture photo make sure you have good lighting and look directly at the camera",
        icon: Camera
    },
    {
        id: 4,
        title: "Review & Submit",
        description: "Review all information before submitting",
        icon: Eye
    },
]

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
]

export default function IdentityVerificationForm() {
    const [ currentStep, setCurrentStep ] = useState(1)
    const [ formData, setFormData ] = useState({
        fullName: "",
        phone: "",
        email: "",
        state: "",
        address: "",
        ssn: "",
        frontId: null as File | null,
        backId: null as File | null,
        selfie: "" as string,
    })
    const [ cameraActive, setCameraActive ] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const nextStep = () => {
        if (currentStep < steps.length) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [ e.target.name ]: e.target.value })
    }

    const handleStateChange = (value: string) => {
        setFormData({ ...formData, state: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const { name, files } = e.target
        setFormData({ ...formData, [ name ]: files[ 0 ] })
    }

    const handleFileRemove = (fieldName: string) => {
        setFormData({ ...formData, [ fieldName ]: null })
        // Reset the file input
        const fileInput = document.getElementById(fieldName) as HTMLInputElement
        if (fileInput) {
            fileInput.value = ""
        }
    }

    const startCamera = async () => {
        try {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                videoRef.current.srcObject = stream
                setCameraActive(true)
            }
        } catch (error) {
            console.error("Error accessing camera:", error)
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            setCameraActive(false)
        }
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, 320, 240)
                const imageData = canvasRef.current.toDataURL("image/png")
                setFormData({ ...formData, selfie: imageData })
                stopCamera()
            }
        }
    }

    const isStepValid = (stepId: number) => {
        switch (stepId) {
            case 1:
                return formData.fullName && formData.phone && formData.email && formData.state && formData.address && formData.ssn
            case 2:
                return formData.frontId && formData.backId
            case 3:
                return formData.selfie
            case 4:
                return true
            default:
                return false
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div className="w-full space-y-2">
                                <Label htmlFor="state">State *</Label>
                                <Select value={formData.state} onValueChange={handleStateChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states.map((state) => (
                                            <SelectItem key={state} value={state}>
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <Label htmlFor="address">Full Address *</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="1234 Main St, City, State 12345"
                            />
                        </div>

                        <div className="w-full space-y-2">
                            <Label htmlFor="ssn">Social Security Number *</Label>
                            <Input
                                id="ssn"
                                type="password"
                                name="ssn"
                                value={formData.ssn}
                                onChange={handleChange}
                                placeholder="XXX-XX-XXXX"
                                maxLength={11}
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="w-full space-y-8">
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card className="border-dashed border-2 transition-colors">
                                <CardContent className="p-8 text-center">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="frontId" className="text-lg font-medium">
                                                Front of ID *
                                            </Label>
                                            <p className="text-sm">
                                                Upload the front side of your government-issued ID
                                            </p>
                                        </div>
                                        <div className="w-full">
                                            {!formData.frontId && (
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <label
                                                        htmlFor="frontId"
                                                        className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer transition"
                                                    >
                                                        <svg
                                                            className="w-10 h-10 mb-3 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                            />
                                                        </svg>
                                                        <p className="text-sm text-gray-500">Click to upload front ID</p>
                                                        <Input
                                                            id="frontId"
                                                            type="file"
                                                            name="frontId"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        {formData.frontId && (
                                            <div className="relative w-full h-64 border-2 hover:border-gray-400 rounded-lg overflow-hidden group">
                                                <Image
                                                    width={400}
                                                    height={300}
                                                    src={URL.createObjectURL(formData.frontId)}
                                                    alt="Front ID Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleFileRemove("frontId")}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 w-8 h-8 p-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-dashed border-2 transition-colors">
                                <CardContent className="p-8 text-center">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="backId" className="text-lg font-medium">
                                                Back of ID *
                                            </Label>
                                            <p className="text-sm">
                                                Upload the back side of your government-issued ID
                                            </p>
                                        </div>
                                        <div className="w-full">
                                            {!formData.backId && (
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <label
                                                        htmlFor="backId"
                                                        className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer transition"
                                                    >
                                                        <svg
                                                            className="w-10 h-10 mb-3 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                            />
                                                        </svg>
                                                        <p className="text-sm text-gray-500">Click to upload back ID</p>
                                                        <Input
                                                            id="backId"
                                                            type="file"
                                                            name="backId"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        {formData.backId && (
                                            <div className="relative w-full h-64 border-2 hover:border-gray-400 rounded-lg overflow-hidden group">
                                                <Image
                                                    width={400}
                                                    height={300}
                                                    src={URL.createObjectURL(formData.backId)}
                                                    alt="Back ID Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleFileRemove("backId")}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 w-8 h-8 p-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="w-full space-y-8">
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card className="border-dashed border-2 transition-colors">
                                <CardContent className="p-8 text-center">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-lg font-medium">
                                                Camera & Photo Capture *
                                            </Label>
                                            <p className="text-sm">
                                                Take a selfie for verification. Make sure you have good lighting and look directly at the camera.
                                            </p>
                                        </div>

                                        {/* Camera View */}
                                        <div className="relative flex justify-center">
                                            <div className="relative">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    className={`w-80 h-60 border-2 rounded-lg ${cameraActive ? "border-green-500" : "border-gray-300"
                                                        } bg-gray-100`}
                                                />
                                                {!cameraActive && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                                        <div className="text-center">
                                                            <Camera className="mx-auto h-24 w-24 text-gray-400 mb-2" />
                                                            <p className="text-gray-500">Camera inactive</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center">
                                            {!cameraActive ? (
                                                <Button onClick={startCamera} size="lg">
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    Start Camera
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button onClick={capturePhoto} size="lg">
                                                        <Camera className="w-4 h-4 mr-2" />
                                                        Capture Photo
                                                    </Button>
                                                    <Button variant="outline" onClick={stopCamera} size="lg">
                                                        Stop Camera
                                                    </Button>
                                                </>
                                            )}
                                        </div>

                                        <canvas ref={canvasRef} width={320} height={240} className="hidden" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-dashed border-2 transition-colors">
                                <CardContent className="p-8 text-center">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-lg font-medium">
                                                Verification Photo *
                                            </Label>
                                            <p className="text-sm">
                                                Your captured photo will appear here once taken.
                                            </p>
                                        </div>

                                        {/* Captured Image + Badge */}
                                        {formData.selfie ? (
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="relative w-full h-64 border-2 hover:border-gray-400 rounded-lg overflow-hidden group">
                                                    <Image
                                                        width={320}
                                                        height={240}
                                                        src={formData.selfie}
                                                        alt="Captured selfie"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="w-full flex items-center justify-center gap-1 bg-green-100 text-green-800 py-2 rounded-md"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Photo captured successfully
                                                </Badge>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg">
                                                <div className="text-center">
                                                    <Camera className="mx-auto h-16 w-16 text-gray-400 mb-2" />
                                                    <p className="text-gray-500">No photo captured yet</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Full Name:</span>
                                        <span>{formData.fullName}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Phone:</span>
                                        <span>{formData.phone}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Email:</span>
                                        <span>{formData.email}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">State:</span>
                                        <span>{formData.state}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Address:</span>
                                        <span className="text-right max-w-xs">{formData.address}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">SSN:</span>
                                        <span>***-**-{formData.ssn.slice(-4)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {formData.frontId && (
                                        <div className="text-center">
                                            <Label className="text-sm font-medium text-gray-600">Front ID</Label>
                                            <Image
                                                width={100}
                                                height={100}
                                                src={URL.createObjectURL(formData.frontId)}
                                                alt="Front ID"
                                                className="w-full h-full object-cover border rounded-lg mt-1"
                                            />
                                        </div>
                                    )}
                                    {formData.backId && (
                                        <div className="text-center">
                                            <Label className="text-sm font-medium text-gray-600">Back ID</Label>
                                            <Image
                                                width={100}
                                                height={100}
                                                src={URL.createObjectURL(formData.backId)}
                                                alt="Back ID"
                                                className="w-full h-full object-cover border rounded-lg mt-1"
                                            />
                                        </div>
                                    )}
                                    {formData.selfie && (
                                        <div className="text-center">
                                            <Label className="text-sm font-medium text-gray-600">Verification Photo</Label>
                                            <Image
                                                width={100}
                                                height={100}
                                                src={formData.selfie}
                                                alt="Selfie"
                                                className="w-full h-full object-cover border rounded-lg mt-1"
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            className="w-full py-3 text-lg"
                            size="lg"
                            onClick={() => alert("Form submitted successfully!")}
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Submit Verification Request
                        </Button>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
                    <p className="">Complete the steps below to verify your identity</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">{currentStep} of {steps.length}</span>
                    </div>
                    <Progress value={(currentStep / steps.length) * 100} className="h-2" />
                </div>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id
                            const isValid = isStepValid(step.id)

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <button
                                            onClick={() => setCurrentStep(step.id)}
                                            disabled={currentStep < step.id && !isValid}
                                            className={`
                                                w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold 
                                                transition-all duration-200 border-2
                                                ${isActive
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110"
                                                    : isCompleted
                                                        ? "bg-green-600 text-white border-green-600"
                                                        : "bg-white text-gray-400 border-gray-300 hover:border-gray-400"
                                                }
                                                ${currentStep < step.id && !isValid ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                                            `}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </button>
                                        <div className="mt-2 text-center max-w-24">
                                            <p className={`text-xs font-medium ${isActive || isCompleted ? "text-blue-600" : "text-gray-500"}`}>
                                                {step.title}
                                            </p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`
                                            flex-1 h-0.5 mx-4 transition-all duration-300
                                            ${currentStep > step.id ? "bg-green-600" : "bg-gray-300"}
                                        `} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <Card className="mb-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            {React.createElement(steps[ currentStep - 1 ].icon, { className: "w-6 h-6" })}
                            {steps[ currentStep - 1 ].title}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {steps[ currentStep - 1 ].description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {renderStepContent()}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        size="lg"
                    >
                        Previous
                    </Button>
                    <Badge variant="secondary" className="px-4 py-2">
                        Step {currentStep} of {steps.length}
                    </Badge>
                    <Button
                        onClick={nextStep}
                        disabled={currentStep === steps.length || !isStepValid(currentStep)}
                        size="lg"
                    >
                        {currentStep === steps.length ? "Complete" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    )
}