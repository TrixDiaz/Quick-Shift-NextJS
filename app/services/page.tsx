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
import { CheckCircle, Upload, Camera, User, Eye, X, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

const steps = [
    {
        id: 1,
        title: "Personal Information",
        description: "Please provide your personal details",
        icon: User
    },
    {
        id: 2,
        title: "Philippine Driver's License",
        description: "Upload or capture front and back of your Philippine Driver's License",
        icon: Upload
    },
    {
        id: 3,
        title: "Live Photo Verification",
        description: "Take a live selfie for face matching verification with your ID photo",
        icon: Camera
    },
    {
        id: 4,
        title: "Review & Submit",
        description: "Review all information and verification results before submitting",
        icon: Eye
    },
]

const coutries = [
    "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
    "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming", "Other"
]

export default function IdentityVerificationForm() {
    const [ currentStep, setCurrentStep ] = useState(1)
    const [ formData, setFormData ] = useState({
        fullName: "",
        phone: "",
        email: "",
        state: "",
        ssn: "",
        licenseNumber: "",
        dateOfBirth: "",
        bloodType: "",
        frontId: null as File | null,
        backId: null as File | null,
        frontIdCaptured: "" as string,
        backIdCaptured: "" as string,
        selfie: "" as string,
    })
    const [ cameraActive, setCameraActive ] = useState(false)
    const [ idCaptureMode, setIdCaptureMode ] = useState<"upload" | "capture">("upload")
    const [ currentIdSide, setCurrentIdSide ] = useState<"front" | "back">("front")
    const [ uploadingFrontId, setUploadingFrontId ] = useState(false)
    const [ uploadingBackId, setUploadingBackId ] = useState(false)
    const [ faceMatching, setFaceMatching ] = useState(false)
    const [ matchResult, setMatchResult ] = useState<{
        overallScore: number;
        matchPercentage: number;
        isMatch: boolean;
        method: string;
    } | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const compareImages = async (image1Base64: string, image2Base64: string) => {
        try {
            setFaceMatching(true)
            setMatchResult(null)

            // Validate base64 strings
            if (!image1Base64 || !image2Base64) {
                throw new Error('Invalid image data')
            }

            // Show loading toast
            toast.loading("Verifying face match...", { id: "face-matching" })

            const response = await fetch('/api/compare-faces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_image: image1Base64,
                    live_image: image2Base64
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `API Error: ${response.status}`)
            }

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Face matching failed')
            }

            const matchPercentage = Math.round(result.match_percentage)
            const isMatch = result.is_match && matchPercentage >= 60

            const matchData = {
                overallScore: result.match_percentage / 100,
                matchPercentage,
                isMatch,
                method: result.method || "face_recognition"
            }

            setMatchResult(matchData)

            // Dismiss loading toast and show result
            toast.dismiss("face-matching")

            if (isMatch) {
                toast.success(`Face match verified! ${matchPercentage}% similarity`, {
                    description: "You can now proceed to the next step."
                })
            } else {
                toast.error(`Face match failed! Only ${matchPercentage}% similarity.`, {
                    description: `Please ensure good lighting and look directly at the camera. Minimum required: 60%. Try taking another photo.`
                })
            }

            return matchData
        } catch (error) {
            console.error('Error comparing images:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

            // Dismiss loading toast and show error
            toast.dismiss("face-matching")
            toast.error(`Failed to verify face match: ${errorMessage}`, {
                description: "Please check your internet connection and try again."
            })

            setMatchResult(null)
            return null
        } finally {
            setFaceMatching(false)
        }
    }

    const nextStep = () => {
        // Additional validation for step 3 (face verification)
        if (currentStep === 3) {
            if (!matchResult || !matchResult.isMatch) {
                toast.error("Face verification is required before proceeding. Please ensure your face matches your ID photo.")
                return
            }
        }

        if (currentStep < steps.length) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [ e.target.name ]: e.target.value })
    }

    const handleProvinceChange = (value: string) => {
        setFormData({ ...formData, state: value })
    }

    const validateFile = (file: File): string | null => {
        // Check file type - more strict validation
        const allowedTypes = [ 'image/png', 'image/jpeg', 'image/jpg' ]
        const allowedExtensions = [ '.png', '.jpg', '.jpeg' ]

        // Check MIME type
        if (!allowedTypes.includes(file.type)) {
            return "Please upload only PNG, JPG, or JPEG files."
        }

        // Check file extension as additional validation
        const fileName = file.name.toLowerCase()
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
        if (!hasValidExtension) {
            return "Please upload only PNG, JPG, or JPEG files."
        }

        // Additional validation: Check if file is actually an image
        if (!file.type.startsWith('image/')) {
            return "Please upload only image files (PNG, JPG, JPEG)."
        }

        // Check file size (3MB = 3 * 1024 * 1024 bytes)
        const maxSize = 3 * 1024 * 1024
        if (file.size > maxSize) {
            return "File size must be less than 3MB."
        }

        // Check minimum file size (files that are too small might be corrupted)
        const minSize = 1024 // 1KB minimum
        if (file.size < minSize) {
            return "File appears to be corrupted or too small."
        }

        return null
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const { name, files } = e.target
        const file = files[ 0 ]

        // Clear any previous errors (now handled by toast)

        // Immediate validation - check file size first (fastest check)
        const maxSize = 3 * 1024 * 1024 // 3MB
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
            toast.error(`File size (${fileSizeMB}MB) exceeds the 3MB limit. Please choose a smaller file.`)
            e.target.value = "" // Clear the input
            return
        }

        // Validate file type and extension
        const validationError = validateFile(file)
        if (validationError) {
            toast.error(validationError)
            e.target.value = "" // Clear the input
            return
        }

        // Only proceed if validation passes
        console.log(`Valid file selected: ${file.name} (${file.size} bytes, ${file.type})`)

        // Set loading state based on which file is being uploaded
        if (name === "frontId") {
            setUploadingFrontId(true)
        } else if (name === "backId") {
            setUploadingBackId(true)
        }

        // Simulate file upload process
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            setFormData({ ...formData, [ name ]: file })
            toast.success(`${name === "frontId" ? "Front ID" : "Back ID"} uploaded successfully!`)
        } catch (error) {
            console.error("Error uploading file:", error)
            toast.error("Upload failed. Please try again.")
        } finally {
            // Clear loading state
            if (name === "frontId") {
                setUploadingFrontId(false)
            } else if (name === "backId") {
                setUploadingBackId(false)
            }
        }
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
                // Reset match result when starting camera for retry
                setMatchResult(null)
                toast.success("Camera started successfully!")
            }
        } catch (error) {
            console.error("Error accessing camera:", error)
            toast.error("Failed to access camera. Please check permissions.")
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            setCameraActive(false)
            toast.info("Camera stopped")
        }
    }

    const resetFaceMatching = () => {
        setMatchResult(null)
        setFormData({ ...formData, selfie: "" })
    }

    const enhanceImageQuality = (imageData: string): Promise<string> => {
        return new Promise<string>((resolve) => {
            const img = document.createElement('img')
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    // Set canvas size to a standard size for better processing
                    const targetSize = 400
                    canvas.width = targetSize
                    canvas.height = targetSize

                    // Draw the image scaled to target size
                    ctx.drawImage(img, 0, 0, targetSize, targetSize)

                    // Get image data
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const data = imageData.data

                    // Convert to grayscale with enhanced processing
                    for (let i = 0; i < data.length; i += 4) {
                        // Use luminance formula for better grayscale conversion
                        const gray = data[ i ] * 0.299 + data[ i + 1 ] * 0.587 + data[ i + 2 ] * 0.114

                        // Apply slight contrast enhancement
                        const enhanced = Math.min(255, Math.max(0, (gray - 128) * 1.1 + 128))

                        data[ i ] = enhanced     // Red
                        data[ i + 1 ] = enhanced // Green
                        data[ i + 2 ] = enhanced // Blue
                        // Alpha channel (data[i + 3]) remains unchanged
                    }

                    // Put the modified data back
                    ctx.putImageData(imageData, 0, 0)

                    // Convert back to data URL with high quality
                    const enhancedDataUrl = canvas.toDataURL('image/png', 0.95)
                    resolve(enhancedDataUrl)
                } else {
                    resolve(imageData) // Fallback to original if canvas context fails
                }
            }
            img.src = imageData
        })
    }

    const capturePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, 320, 240)
                const imageData = canvasRef.current.toDataURL("image/png")

                // Enhance captured photo quality for better matching with ID photos
                const enhancedImageData = await enhanceImageQuality(imageData)

                setFormData({ ...formData, selfie: enhancedImageData })
                stopCamera()
                toast.success("Selfie captured and processed for face matching!")

                // Reset previous match result when taking a new photo
                setMatchResult(null)

                // Trigger face matching if front ID is available
                const frontIdImage = idCaptureMode === "upload" ? formData.frontId : formData.frontIdCaptured
                if (frontIdImage) {
                    if (idCaptureMode === "upload" && formData.frontId) {
                        // Convert uploaded file to base64
                        const reader = new FileReader()
                        reader.onload = async () => {
                            const base64String = reader.result as string
                            await compareImages(base64String, enhancedImageData)
                        }
                        reader.readAsDataURL(formData.frontId)
                    } else if (idCaptureMode === "capture" && formData.frontIdCaptured) {
                        // Use captured front ID image
                        await compareImages(formData.frontIdCaptured, enhancedImageData)
                    }
                } else {
                    toast.warning("Please upload or capture your front ID first for face verification")
                }
            }
        }
    }

    const captureIdPhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, 400, 300)
                const imageData = canvasRef.current.toDataURL("image/png")
                if (currentIdSide === "front") {
                    setFormData({ ...formData, frontIdCaptured: imageData })
                    toast.success("Front ID captured successfully!")
                } else {
                    setFormData({ ...formData, backIdCaptured: imageData })
                    toast.success("Back ID captured successfully!")
                }
                stopCamera()
            }
        }
    }

    const isStepValid = (stepId: number): boolean => {
        switch (stepId) {
            case 1:
                return !!(formData.fullName && formData.phone && formData.email && formData.state && formData.ssn && formData.licenseNumber)
            case 2:
                if (idCaptureMode === "upload") {
                    return !!(formData.frontId && formData.backId)
                } else {
                    return !!(formData.frontIdCaptured && formData.backIdCaptured)
                }
            case 3:
                // Step 3 requires both selfie and successful face match
                return !!(formData.selfie && matchResult && matchResult.isMatch && matchResult.matchPercentage >= 60)
            case 4:
                // Step 4 requires all previous steps to be valid, including face match
                return isStepValid(1) && isStepValid(2) && isStepValid(3)
            default:
                return false
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid gap-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">Driver&apos;s License Information</h3>
                            <p className="text-sm text-gray-600">Please enter your personal details as they appear on your driver&apos;s license</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full space-y-2">
                                <Label htmlFor="fullName">Full Name (as on license) *</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name as shown on license"
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
                                    placeholder="+1 (555) 123-4567"
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
                                <Label htmlFor="states">Country *</Label>
                                <Select value={formData.state} onValueChange={handleProvinceChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {coutries.map((states) => (
                                            <SelectItem key={states} value={states}>
                                                {states}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full space-y-2">
                                <Label htmlFor="licenseNumber">License Number *</Label>
                                <Input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="e.g., N02-23-030042"
                                />
                            </div>
                            <div className="w-full space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <Label htmlFor="ssn">SSN*</Label>
                            <Input
                                id="ssn"
                                name="ssn"
                                value={formData.ssn}
                                onChange={handleChange}
                                placeholder="SSN"
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="w-full space-y-8">
                        {/* Mode Selection */}
                        <div className="flex justify-center mb-6">
                            <div className="flex rounded-lg p-1">
                                <Button
                                    variant={idCaptureMode === "upload" ? "default" : "ghost"}
                                    onClick={() => setIdCaptureMode("upload")}
                                    className="px-6"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Photos
                                </Button>
                                <Button
                                    variant={idCaptureMode === "capture" ? "default" : "ghost"}
                                    onClick={() => setIdCaptureMode("capture")}
                                    className="px-6"
                                >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Capture Photos
                                </Button>
                            </div>
                        </div>

                        {idCaptureMode === "upload" ? (
                            /* Upload Mode */
                            <div className="grid gap-8 md:grid-cols-2">
                                <Card className="border-dashed border-2 transition-colors">
                                    <CardContent className="p-8 text-center">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="frontId" className="text-lg font-medium">
                                                    Front of Philippine Driver&apos;s License *
                                                </Label>
                                                <p className="text-sm">
                                                    Upload the front side of your Philippine Driver&apos;s License. Ensure the photo is clear and shows your face and license details.
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Accepted formats: PNG, JPG, JPEG (max 3MB)
                                                </p>
                                            </div>
                                            <div className="w-full">
                                                {!formData.frontId && !uploadingFrontId && (
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
                                                                accept="image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                                capture="environment"
                                                            />
                                                        </label>
                                                    </div>
                                                )}

                                                {uploadingFrontId && (
                                                    <div className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                                                        <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
                                                        <p className="text-sm text-blue-600 font-medium">Uploading front ID...</p>
                                                        <p className="text-xs text-blue-500">Please wait</p>
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
                                                    Back of Philippine Driver&apos;s License *
                                                </Label>
                                                <p className="text-sm">
                                                    Upload the back side of your Philippine Driver&apos;s License. Make sure all text and barcodes are clearly visible.
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Accepted formats: PNG, JPG, JPEG (max 3MB)
                                                </p>
                                            </div>
                                            <div className="w-full">
                                                {!formData.backId && !uploadingBackId && (
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
                                                                accept="image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                                capture="environment"
                                                            />
                                                        </label>
                                                    </div>
                                                )}

                                                {uploadingBackId && (
                                                    <div className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                                                        <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
                                                        <p className="text-sm text-blue-600 font-medium">Uploading back ID...</p>
                                                        <p className="text-xs text-blue-500">Please wait</p>
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
                        ) : (
                            /* Capture Mode */
                            <div className="grid gap-8 md:grid-cols-2">
                                <Card className="border-dashed border-2 transition-colors">
                                    <CardContent className="p-8 text-center">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium">
                                                    Camera & Photo Capture *
                                                </Label>
                                                <p className="text-sm">
                                                    Take photos of your ID. Make sure you have good lighting and the ID is clearly visible.
                                                </p>
                                            </div>

                                            {/* Side Selection */}
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant={currentIdSide === "front" ? "default" : "outline"}
                                                    onClick={() => setCurrentIdSide("front")}
                                                    size="sm"
                                                >
                                                    Front of ID
                                                </Button>
                                                <Button
                                                    variant={currentIdSide === "back" ? "default" : "outline"}
                                                    onClick={() => setCurrentIdSide("back")}
                                                    size="sm"
                                                >
                                                    Back of ID
                                                </Button>
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
                                                        <Button onClick={captureIdPhoto} size="lg">
                                                            <Camera className="w-4 h-4 mr-2" />
                                                            Capture {currentIdSide === "front" ? "Front" : "Back"}
                                                        </Button>
                                                        <Button variant="outline" onClick={stopCamera} size="lg">
                                                            Stop Camera
                                                        </Button>
                                                    </>
                                                )}
                                            </div>

                                            <canvas ref={canvasRef} width={400} height={300} className="hidden" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-dashed border-2 transition-colors">
                                    <CardContent className="p-8 text-center">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium">
                                                    Captured Photos *
                                                </Label>
                                                <p className="text-sm">
                                                    Your captured ID photos will appear here.
                                                </p>
                                            </div>

                                            <div className="grid gap-4">
                                                {/* Front ID Captured */}
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-600">Front of ID</Label>
                                                    {formData.frontIdCaptured ? (
                                                        <div className="relative w-full h-48 border-2 hover:border-gray-400 rounded-lg overflow-hidden group">
                                                            <Image
                                                                width={600}
                                                                height={400}
                                                                src={formData.frontIdCaptured}
                                                                alt="Front ID Captured"
                                                                className="w-full h-full object-contain"
                                                            />
                                                            <Badge
                                                                variant="secondary"
                                                                className="absolute top-2 left-2 bg-green-100 text-green-800"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Captured
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg">
                                                            <p className="text-gray-500 text-sm">Not captured yet</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Back ID Captured */}
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-600">Back of ID</Label>
                                                    {formData.backIdCaptured ? (
                                                        <div className="relative w-full h-48 border-2 hover:border-gray-400 rounded-lg overflow-hidden group">
                                                            <Image
                                                                width={600}
                                                                height={400}
                                                                src={formData.backIdCaptured}
                                                                alt="Back ID Captured"
                                                                className="w-full h-full object-contain"
                                                            />
                                                            <Badge
                                                                variant="secondary"
                                                                className="absolute top-2 left-2 bg-green-100 text-green-800"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Captured
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg">
                                                            <p className="text-gray-500 text-sm">Not captured yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
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
                                                Take a live selfie for face verification. Make sure you have good lighting, look directly at the camera, and remove any glasses or hats. Your photo will be compared with the face on your Philippine Driver&apos;s License using advanced face recognition technology.
                                            </p>
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <p className="text-xs text-blue-800">
                                                    <strong>Tips for best results:</strong><br />
                                                    • Ensure good, even lighting<br />
                                                    • Look directly at the camera<br />
                                                    • Remove glasses, hats, or face coverings<br />
                                                    • Keep a neutral expression<br />
                                                    • Make sure your face fills the frame
                                                </p>
                                            </div>
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

                                                {/* Face Matching Results */}
                                                {faceMatching && (
                                                    <div className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-800 py-2 rounded-md">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Verifying face match...</span>
                                                    </div>
                                                )}

                                                {matchResult && !faceMatching && (
                                                    <div className="w-full space-y-2">
                                                        <Badge
                                                            variant={matchResult.isMatch ? "default" : "destructive"}
                                                            className={`w-full flex items-center justify-center gap-1 py-2 rounded-md ${matchResult.isMatch
                                                                ? "bg-green-100 text-green-800 border-green-200"
                                                                : "bg-red-100 text-red-800 border-red-200"
                                                                }`}
                                                        >
                                                            {matchResult.isMatch ? (
                                                                <CheckCircle className="w-4 h-4" />
                                                            ) : (
                                                                <AlertCircle className="w-4 h-4" />
                                                            )}
                                                            {matchResult.isMatch ? "Face Match Verified!" : "Face Match Failed"}
                                                        </Badge>

                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-gray-800">
                                                                {matchResult.matchPercentage}%
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Similarity Score
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Minimum required: 60%
                                                            </div>
                                                        </div>

                                                        {!matchResult.isMatch && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    resetFaceMatching()
                                                                    startCamera()
                                                                }}
                                                                className="w-full mt-2"
                                                            >
                                                                <Camera className="w-4 h-4 mr-2" />
                                                                Retry Photo
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}

                                                {!matchResult && !faceMatching && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-full flex items-center justify-center gap-1 bg-green-100 text-green-800 py-2 rounded-md"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Photo captured successfully
                                                    </Badge>
                                                )}
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
                                        <span className="font-medium text-gray-600">Province/City:</span>
                                        <span>{formData.state}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">License Number:</span>
                                        <span>{formData.licenseNumber}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Date of Birth:</span>
                                        <span>{formData.dateOfBirth}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">SSN:</span>
                                        <span className="text-right max-w-xs">{formData.ssn}</span>
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
                                    {/* Front ID - Upload or Capture */}
                                    {(formData.frontId || formData.frontIdCaptured) && (
                                        <div className="text-center">
                                            <Label className="text-sm font-medium text-gray-600">Front ID</Label>
                                            <Image
                                                width={100}
                                                height={100}
                                                src={formData.frontId ? URL.createObjectURL(formData.frontId) : (formData.frontIdCaptured || "")}
                                                alt="Front ID"
                                                className="w-full h-full object-cover border rounded-lg mt-1"
                                            />
                                        </div>
                                    )}
                                    {/* Back ID - Upload or Capture */}
                                    {(formData.backId || formData.backIdCaptured) && (
                                        <div className="text-center">
                                            <Label className="text-sm font-medium text-gray-600">Back ID</Label>
                                            <Image
                                                width={100}
                                                height={100}
                                                src={formData.backId ? URL.createObjectURL(formData.backId) : (formData.backIdCaptured || "")}
                                                alt="Back ID"
                                                className="w-full h-full object-cover border rounded-lg mt-1"
                                            />
                                        </div>
                                    )}
                                    {formData.selfie && (
                                        <div className="text-center">
                                            <Label className="text-sm font-medium text-gray-600">Verification Photo</Label>
                                            <div className="relative">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={formData.selfie}
                                                    alt="Selfie"
                                                    className="w-full h-full object-cover border rounded-lg mt-1"
                                                />
                                                {matchResult && (
                                                    <Badge
                                                        variant={matchResult.isMatch ? "default" : "destructive"}
                                                        className={`absolute -top-2 -right-2 text-xs ${matchResult.isMatch
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {matchResult.matchPercentage}%
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            className="w-full py-3 text-lg"
                            size="lg"
                            onClick={async () => {
                                // Final validation before submission
                                if (!isStepValid(3)) {
                                    toast.error("Face verification is required before submission. Please complete all steps.")
                                    return
                                }

                                try {
                                    // Show loading toast
                                    toast.loading("Submitting verification request...", { id: "submitting" })

                                    // Convert uploaded files to base64
                                    let frontIdBase64 = null;
                                    let backIdBase64 = null;

                                    if (formData.frontId) {
                                        const reader = new FileReader();
                                        frontIdBase64 = await new Promise((resolve) => {
                                            reader.onload = () => resolve(reader.result as string);
                                            reader.readAsDataURL(formData.frontId!);
                                        });
                                    }

                                    if (formData.backId) {
                                        const reader = new FileReader();
                                        backIdBase64 = await new Promise((resolve) => {
                                            reader.onload = () => resolve(reader.result as string);
                                            reader.readAsDataURL(formData.backId!);
                                        });
                                    }

                                    // Prepare form data for submission
                                    const submissionData = {
                                        fullName: formData.fullName,
                                        phone: formData.phone,
                                        email: formData.email,
                                        province: formData.state,
                                        ssn: formData.ssn,
                                        licenseNumber: formData.licenseNumber,
                                        dateOfBirth: formData.dateOfBirth,
                                        bloodType: formData.bloodType,
                                        frontId: frontIdBase64,
                                        backId: backIdBase64,
                                        frontIdCaptured: formData.frontIdCaptured,
                                        backIdCaptured: formData.backIdCaptured,
                                        selfie: formData.selfie,
                                        matchResult: matchResult
                                    }

                                    // Debug logging
                                    console.log('Submitting form data:', {
                                        ...submissionData,
                                        frontId: frontIdBase64 ? 'Present (converted to base64)' : 'Missing',
                                        backId: backIdBase64 ? 'Present (converted to base64)' : 'Missing',
                                        frontIdCaptured: formData.frontIdCaptured ? 'Present' : 'Missing',
                                        backIdCaptured: formData.backIdCaptured ? 'Present' : 'Missing',
                                        selfie: formData.selfie ? 'Present' : 'Missing',
                                        matchResult: matchResult ? 'Present' : 'Missing'
                                    })

                                    // Submit to API
                                    const response = await fetch('/api/stepper-form', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(submissionData)
                                    })

                                    if (!response.ok) {
                                        // Handle error responses
                                        const contentType = response.headers.get('content-type')
                                        if (contentType && contentType.includes('application/json')) {
                                            const result = await response.json()
                                            throw new Error(result.error || result.details || 'Failed to submit verification request')
                                        } else {
                                            throw new Error(`Server error: ${response.status} ${response.statusText}`)
                                        }
                                    }

                                    // Check if response is a redirect (302 status)
                                    if (response.status === 302) {
                                        // Dismiss loading toast
                                        toast.dismiss("submitting")

                                        // Redirect to thank you page
                                        window.location.href = '/thank-you'
                                        return
                                    }

                                    // Handle JSON response (fallback)
                                    const contentType = response.headers.get('content-type')
                                    if (contentType && contentType.includes('application/json')) {
                                        await response.json() // Read the response but don't use it

                                        // Dismiss loading toast and show success
                                        toast.dismiss("submitting")
                                        toast.success("Identity verification request submitted successfully!", {
                                            description: "Your verification request has been sent via email. We'll review it shortly."
                                        })
                                    } else {
                                        // If not JSON and not redirect, treat as success and redirect
                                        toast.dismiss("submitting")
                                        window.location.href = '/thank-you'
                                    }

                                } catch (error) {
                                    console.error('Error submitting form:', error)
                                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

                                    // Dismiss loading toast and show error
                                    toast.dismiss("submitting")
                                    toast.error(`Failed to submit verification request: ${errorMessage}`, {
                                        description: "Please check your internet connection and try again."
                                    })
                                }
                            }}
                            disabled={!isStepValid(4)}
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
                    <h1 className="text-3xl font-bold mb-2">Philippine Driver&apos;s License Verification</h1>
                    <p className="">Complete the steps below to verify your identity using your Philippine Driver&apos;s License</p>
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
                                                        : step.id === 3 && matchResult && !matchResult.isMatch
                                                            ? "bg-red-100 text-red-600 border-red-300"
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