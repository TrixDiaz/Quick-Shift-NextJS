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
import { CheckCircle, Upload, Camera, User, Eye, X, Loader2, ChevronDown } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { AlertTitle } from "@/components/ui/alert"

const steps = [
    {
        id: 1,
        title: "Personal Information",
        description: "Please provide your personal details",
        icon: User
    },
    {
        id: 2,
        title: "Driver's License",
        description: "Upload front and back of your Driver's License",
        icon: Upload
    },
    {
        id: 3,
        title: "Video Live Verification",
        description: "Record a live video for identity verification (auto-stops after 7 seconds)",
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
        videoBlob: null as Blob | null,
        videoUrl: "" as string,
    })
    const [ cameraActive, setCameraActive ] = useState(false)
    const [ uploadingFrontId, setUploadingFrontId ] = useState(false)
    const [ uploadingBackId, setUploadingBackId ] = useState(false)
    const [ isRecording, setIsRecording ] = useState(false)
    const [ recordingTime, setRecordingTime ] = useState(0)
    const [ mediaRecorder, setMediaRecorder ] = useState<MediaRecorder | null>(null)
    const [ showTips, setShowTips ] = useState(false)
    const [ showTroubleshooting, setShowTroubleshooting ] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Helper function to check camera permissions
    const checkCameraPermissions = async (): Promise<boolean> => {
        try {
            if (!navigator.permissions) {
                return true // If permissions API is not supported, assume we can try
            }

            const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
            return permission.state !== 'denied'
        } catch {
            console.log('Permission check failed, proceeding with camera access attempt')
            return true // If permission check fails, try anyway
        }
    }

    // Helper function to get file size in human readable format
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = [ 'Bytes', 'KB', 'MB', 'GB' ]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[ i ]
    }

    // Helper function to compress image file
    const compressImage = (file: File, maxSizeKB: number = 500): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new window.Image()

            img.onload = () => {
                // Calculate new dimensions to reduce file size
                let { width, height } = img
                const maxDimension = 800 // Max width or height

                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width
                        width = maxDimension
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height
                        height = maxDimension
                    }
                }

                canvas.width = width
                canvas.height = height

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height)

                    // Try different quality levels until we get under the size limit
                    const tryCompress = (quality: number) => {
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const sizeKB = blob.size / 1024
                                if (sizeKB <= maxSizeKB || quality <= 0.1) {
                                    // Create a new file with the compressed blob
                                    const compressedFile = new File([ blob ], file.name, {
                                        type: 'image/jpeg',
                                        lastModified: Date.now()
                                    })
                                    console.log(`Image compressed: ${formatFileSize(file.size)} -> ${formatFileSize(blob.size)}`)
                                    resolve(compressedFile)
                                } else {
                                    // Try with lower quality
                                    tryCompress(quality - 0.1)
                                }
                            } else {
                                resolve(file) // Fallback to original
                            }
                        }, 'image/jpeg', quality)
                    }

                    // Start with 0.8 quality
                    tryCompress(0.8)
                } else {
                    resolve(file) // Fallback if canvas context fails
                }
            }

            img.onerror = () => resolve(file) // Fallback if image load fails
            img.src = URL.createObjectURL(file)
        })
    }

    const startVideoRecording = async () => {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                toast.error("Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.")
                return
            }

            // Check camera permissions first
            const hasPermission = await checkCameraPermissions()
            if (!hasPermission) {
                toast.error("Camera access is blocked. Please enable camera permissions in your browser settings and refresh the page.")
                return
            }

            if (videoRef.current) {
                // Request camera and microphone permissions with very low quality for smallest file size
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 320, max: 320 }, // Very small resolution
                        height: { ideal: 240, max: 240 }, // Very small resolution
                        frameRate: { ideal: 10, max: 10 }, // Very low frame rate
                        facingMode: 'user' // Front camera
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 8000 // Very low sample rate for smallest file
                    }
                })

                videoRef.current.srcObject = stream
                setCameraActive(true)

                // Check for supported MIME types and create MediaRecorder with compression
                let mimeType = 'video/webm;codecs=vp8' // Default fallback
                let recorderOptions: MediaRecorderOptions = {}

                // Prefer WebM with VP8 for better compression
                if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                    mimeType = 'video/webm;codecs=vp8'
                    recorderOptions = {
                        mimeType: mimeType,
                        videoBitsPerSecond: 50000, // Extremely low bitrate: 50 kbps
                        audioBitsPerSecond: 16000  // Very low audio bitrate: 16 kbps
                    }
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                    mimeType = 'video/webm;codecs=vp9'
                    recorderOptions = {
                        mimeType: mimeType,
                        videoBitsPerSecond: 50000,
                        audioBitsPerSecond: 16000
                    }
                } else if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
                    mimeType = 'video/mp4;codecs=h264'
                    recorderOptions = {
                        mimeType: mimeType,
                        videoBitsPerSecond: 50000,
                        audioBitsPerSecond: 16000
                    }
                } else {
                    // Fallback with basic options
                    recorderOptions = { mimeType: mimeType }
                }

                // Create MediaRecorder with compression settings
                const recorder = new MediaRecorder(stream, recorderOptions)

                const chunks: BlobPart[] = []

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data)
                    }
                }

                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: mimeType })
                    const url = URL.createObjectURL(blob)
                    setFormData({ ...formData, videoBlob: blob, videoUrl: url })
                    toast.success(`Video recorded successfully! (${formatFileSize(blob.size)})`)
                }

                setMediaRecorder(recorder)
                toast.success("Camera started! Click 'Start Recording' to begin.")
            }
        } catch (error: unknown) {
            console.error("Error accessing camera:", error)

            // Provide specific error messages based on error type
            const errorObj = error as Error
            if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
                toast.error("Camera access denied. Please allow camera permissions and refresh the page.", {
                    description: "Click the camera icon in your browser's address bar to enable permissions."
                })
            } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
                toast.error("No camera found. Please connect a camera and try again.")
            } else if (errorObj.name === 'NotReadableError' || errorObj.name === 'TrackStartError') {
                toast.error("Camera is already in use by another application. Please close other apps using the camera.")
            } else if (errorObj.name === 'OverconstrainedError' || errorObj.name === 'ConstraintNotSatisfiedError') {
                toast.error("Camera constraints cannot be satisfied. Please try with a different camera.")
            } else if (errorObj.name === 'NotSupportedError') {
                toast.error("Camera access is not supported in this browser. Please use Chrome, Firefox, or Safari.")
            } else if (errorObj.name === 'SecurityError') {
                toast.error("Camera access blocked due to security restrictions. Please use HTTPS or localhost.")
            } else {
                toast.error("Failed to access camera. Please check your camera permissions and try again.", {
                    description: "Make sure your camera is connected and not being used by another application."
                })
            }
        }
    }

    const startRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            mediaRecorder.start()
            setIsRecording(true)
            setRecordingTime(0)

            // Start timer
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    const newTime = prev + 1
                    // Auto-stop recording after 7 seconds
                    if (newTime >= 7) {
                        stopRecording()
                    }
                    return newTime
                })
            }, 1000)

            toast.info("Recording started... (will auto-stop in 7 seconds)")
        }
    }

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop()
            setIsRecording(false)

            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current)
                recordingIntervalRef.current = null
            }

            toast.info("Recording stopped!")
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            setCameraActive(false)
            setIsRecording(false)
            setRecordingTime(0)

            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current)
                recordingIntervalRef.current = null
            }

            toast.info("Camera stopped")
        }
    }

    const nextStep = () => {
        // Additional validation for step 3 (video recording)
        if (currentStep === 3) {
            if (!formData.videoBlob || recordingTime < 5 || recordingTime > 7) {
                toast.error("Video recording must be between 5-7 seconds before proceeding.")
                return
            }
        }

        if (currentStep < steps.length) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    // Validation functions
    const validateName = (value: string) => {
        // Only allow letters, spaces, hyphens, and apostrophes
        return /^[a-zA-Z\s\-']+$/.test(value)
    }

    const validatePhone = (value: string) => {
        // Allow numbers, spaces, parentheses, hyphens, and plus sign
        return /^[\d\s\(\)\-\+]+$/.test(value)
    }

    const validateSSN = (value: string) => {
        // Allow numbers, spaces, and hyphens
        return /^[\d\s\-]+$/.test(value)
    }

    const validateLicenseNumber = (value: string) => {
        // Allow alphanumeric characters, spaces, and hyphens
        return /^[a-zA-Z0-9\s\-]+$/.test(value)
    }

    const validateEmail = (value: string) => {
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Apply validation based on field type
        switch (name) {
            case 'fullName':
                if (value === '' || validateName(value)) {
                    setFormData({ ...formData, [ name ]: value })
                } else {
                    toast.error("Name can only contain letters, spaces, hyphens, and apostrophes")
                }
                break
            case 'phone':
                if (value === '' || validatePhone(value)) {
                    setFormData({ ...formData, [ name ]: value })
                } else {
                    toast.error("Phone number can only contain numbers, spaces, parentheses, hyphens, and plus sign")
                }
                break
            case 'ssn':
                if (value === '' || validateSSN(value)) {
                    setFormData({ ...formData, [ name ]: value })
                } else {
                    toast.error("SSN can only contain numbers, spaces, and hyphens")
                }
                break
            case 'licenseNumber':
                if (value === '' || validateLicenseNumber(value)) {
                    setFormData({ ...formData, [ name ]: value })
                } else {
                    toast.error("License number can only contain letters, numbers, spaces, and hyphens")
                }
                break
            case 'email':
                // Allow typing but only show error for complete invalid emails
                setFormData({ ...formData, [ name ]: value })
                // Only show error if user has typed something and it's clearly invalid
                if (value.length > 5 && !validateEmail(value)) {
                    // Don't show toast for partial emails, just update the field
                }
                break
            default:
                setFormData({ ...formData, [ name ]: value })
                break
        }
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

        // Check file size (10MB = 10 * 1024 * 1024 bytes) - will be compressed
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return "File size must be less than 10MB."
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
        const maxSize = 10 * 1024 * 1024 // 10MB - we'll compress it down
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
            toast.error(`File size (${fileSizeMB}MB) is too large. Please choose a smaller file.`)
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

        // Compress and upload file
        try {
            // Compress the image to reduce file size
            const compressedFile = await compressImage(file, 500) // Max 500KB

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            setFormData({ ...formData, [ name ]: compressedFile })
            toast.success(`${name === "frontId" ? "Front ID" : "Back ID"} uploaded successfully! (${formatFileSize(compressedFile.size)})`)
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


    const isStepValid = (stepId: number): boolean => {
        switch (stepId) {
            case 1:
                return !!(
                    formData.fullName &&
                    validateName(formData.fullName) &&
                    formData.phone &&
                    validatePhone(formData.phone) &&
                    formData.email &&
                    validateEmail(formData.email) &&
                    formData.state &&
                    formData.ssn &&
                    validateSSN(formData.ssn) &&
                    formData.licenseNumber &&
                    validateLicenseNumber(formData.licenseNumber)
                )
            case 2:
                return !!(formData.frontId && formData.backId)
            case 3:
                // Step 3 requires video recording between 5-7 seconds
                return !!(formData.videoBlob && recordingTime >= 5 && recordingTime <= 7)
            case 4:
                // Step 4 requires all previous steps to be valid
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
                                    className={`${formData.fullName && !validateName(formData.fullName) ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {formData.fullName && !validateName(formData.fullName) && (
                                    <p className="text-xs text-red-500">Name can only contain letters, spaces, hyphens, and apostrophes</p>
                                )}
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
                                    className={`${formData.phone && !validatePhone(formData.phone) ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {formData.phone && !validatePhone(formData.phone) && (
                                    <p className="text-xs text-red-500">Phone can only contain numbers, spaces, parentheses, hyphens, and plus sign</p>
                                )}
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
                                    className={`${formData.email && formData.email.length > 5 && !validateEmail(formData.email) ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {formData.email && formData.email.length > 5 && !validateEmail(formData.email) && (
                                    <p className="text-xs text-red-500">Please enter a valid email address</p>
                                )}
                            </div>
                            <div className="w-full space-y-2">
                                <Label htmlFor="states">State *</Label>
                                <Select value={formData.state} onValueChange={handleProvinceChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your state" />
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
                                    className={`${formData.licenseNumber && !validateLicenseNumber(formData.licenseNumber) ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {formData.licenseNumber && !validateLicenseNumber(formData.licenseNumber) && (
                                    <p className="text-xs text-red-500">License number can only contain letters, numbers, spaces, and hyphens</p>
                                )}
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
                                className={`${formData.ssn && !validateSSN(formData.ssn) ? 'border-red-500 focus:border-red-500' : ''}`}
                            />
                            {formData.ssn && !validateSSN(formData.ssn) && (
                                <p className="text-xs text-red-500">SSN can only contain numbers, spaces, and hyphens</p>
                            )}
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
                                                Front of Driver&apos;s License *
                                            </Label>
                                            <p className="text-sm">
                                                Upload the front side of your Driver&apos;s License. Ensure the photo is clear and shows your face and license details.
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Accepted formats: PNG, JPG, JPEG Maximum of 3MB (auto-compressed to ~500KB)
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
                                                    className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 w-8 h-8 p-0"
                                                    title="Remove front ID"
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
                                                Back of Driver&apos;s License *
                                            </Label>
                                            <p className="text-sm">
                                                Upload the back side of your Driver&apos;s License. Make sure all text and barcodes are clearly visible.
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Accepted formats: PNG, JPG, JPEG Maximum of 3MB (auto-compressed to ~500KB)
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
                                                    className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 w-8 h-8 p-0"
                                                    title="Remove back ID"
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
                                        <div className="space-y-3">
                                            <Label className="text-lg font-medium">
                                                Video Live Verification *
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Record a live video for identity verification. Make sure you have good lighting,
                                                look directly at the camera, and speak clearly. The video will automatically stop after 7 seconds
                                                and must be between 5–7 seconds long.
                                            </p>

                                            {/* Tips alert */}
                                            <div className="p-3 rounded-lg border">
                                                <button
                                                    onClick={() => setShowTips(!showTips)}
                                                    className="flex items-center justify-between w-full text-left"
                                                >
                                                    <AlertTitle className="font-semibold text-sm">
                                                        Tips for best results:
                                                    </AlertTitle>

                                                    <ChevronDown
                                                        className={`h-4 w-4 transform transition-transform duration-300 ${showTips ? "rotate-180" : "rotate-0"
                                                            }`}
                                                    />
                                                </button>


                                                {showTips && (
                                                    <div className="mt-3 text-xs space-y-1">
                                                        <p className="font-semibold mb-2">These steps help ensure your video passes verification smoothly:</p>
                                                        <p>• Allow camera permissions when prompted</p>
                                                        <p>• Ensure good, even lighting</p>
                                                        <p>• Look directly at the camera</p>
                                                        <p>• Speak clearly and naturally</p>
                                                        <p>• Keep a neutral expression</p>
                                                        <p>• Recording automatically stops after 7 seconds</p>
                                                        <p>• Video is automatically optimized for small file size</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Troubleshooting alert */}
                                            <div className="p-3 rounded-lg border">
                                                <button
                                                    onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                                                    className="flex items-center justify-between w-full text-left"
                                                >
                                                    <AlertTitle className="font-semibold text-sm">
                                                        Having camera issues?
                                                    </AlertTitle>

                                                    <ChevronDown
                                                        className={`h-4 w-4 transform transition-transform duration-300 ${showTroubleshooting ? "rotate-180" : "rotate-0"
                                                            }`}
                                                    />
                                                </button>

                                                {showTroubleshooting && (
                                                    <div className="mt-3 text-xs space-y-1">
                                                        <p className="font-semibold mb-2">Troubleshooting tips if your camera isn&apos;t working:</p>
                                                        <p>• Make sure your camera is connected</p>
                                                        <p>• Check browser permissions (click camera icon in address bar)</p>
                                                        <p>• Close other apps using the camera</p>
                                                        <p>• Try refreshing the page</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Camera View */}
                                        <div className="relative flex justify-center">
                                            <div className="relative">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    muted
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
                                                {isRecording && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                                        REC {recordingTime}s
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center">
                                            {!cameraActive ? (
                                                <Button onClick={startVideoRecording} size="lg">
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    Start Camera
                                                </Button>
                                            ) : (
                                                <>
                                                    {!isRecording ? (
                                                        <Button onClick={startRecording} size="lg" disabled={!mediaRecorder}>
                                                            <Camera className="w-4 h-4 mr-2" />
                                                            Start Recording
                                                        </Button>
                                                    ) : (
                                                        <Button onClick={stopRecording} size="lg" variant="destructive">
                                                            <Camera className="w-4 h-4 mr-2" />
                                                            Stop Recording
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" onClick={stopCamera} size="lg">
                                                        Stop Camera
                                                    </Button>
                                                </>
                                            )}
                                        </div>

                                        {recordingTime > 0 && (
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">
                                                    Recording time: {recordingTime} seconds
                                                    {recordingTime < 5 && (
                                                        <span className="text-red-500 ml-2">
                                                            (Minimum 5 seconds required)
                                                        </span>
                                                    )}
                                                    {recordingTime > 7 && (
                                                        <span className="text-red-500 ml-2">
                                                            (Maximum 7 seconds allowed)
                                                        </span>
                                                    )}
                                                    {recordingTime >= 5 && recordingTime <= 7 && (
                                                        <span className="text-green-500 ml-2">
                                                            ✓ Perfect length!
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-dashed border-2 transition-colors">
                                <CardContent className="p-8 text-center">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-lg font-medium">
                                                Recorded Video *
                                            </Label>
                                            <p className="text-sm">
                                                Your recorded video will appear here once completed.
                                            </p>
                                        </div>

                                        {/* Video Preview */}
                                        {formData.videoUrl ? (
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="relative w-full h-full border-2 hover:border-gray-400 rounded-lg overflow-hidden group">
                                                    <video
                                                        src={formData.videoUrl}
                                                        controls
                                                        className="w-full h-full object-cover"
                                                        style={{ minHeight: '300px' }}
                                                    />
                                                </div>

                                                <Badge
                                                    variant="secondary"
                                                    className={`w-full flex items-center justify-center gap-1 py-2 rounded-md ${recordingTime >= 5 && recordingTime <= 7
                                                        ? "bg-green-100 text-green-800"
                                                        : recordingTime < 5
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    {recordingTime >= 5 && recordingTime <= 7
                                                        ? "Video recorded successfully!"
                                                        : recordingTime < 5
                                                            ? "Video recorded (minimum 5 seconds required)"
                                                            : "Video recorded (maximum 7 seconds allowed)"
                                                    }
                                                </Badge>

                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-800">
                                                        {recordingTime}s
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Recording Duration
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg">
                                                <div className="text-center">
                                                    <Camera className="mx-auto h-16 w-16 text-gray-400 mb-2" />
                                                    <p className="text-gray-500">No video recorded yet</p>
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
                                <div className="grid gap-4 md:grid-cols-3 mb-2">
                                    {/* Front ID */}
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

                                    {/* Back ID */}
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

                                    {/* Video Recording */}
                                    {formData.videoUrl && (
                                        <div className="text-center">
                                            <Label className="text-sm font-medium text-gray-600">Verification Video</Label>
                                            <div className="relative">
                                                <video
                                                    src={formData.videoUrl}
                                                    className="w-full h-full object-cover border rounded-lg mt-1"
                                                />
                                                <Badge
                                                    variant="default"
                                                    className="absolute -top-2 -right-2 text-xs bg-green-100 text-green-800"
                                                >
                                                    {recordingTime}s
                                                </Badge>
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
                                    toast.error("Video recording between 5-7 seconds is required before submission. Please complete all steps.")
                                    return
                                }

                                try {
                                    // Show loading toast
                                    toast.loading("Submitting verification request...", { id: "submitting" })

                                    // Convert uploaded files to base64
                                    let frontIdBase64 = null;
                                    let backIdBase64 = null;
                                    let videoBase64 = null;

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

                                    if (formData.videoBlob) {
                                        const reader = new FileReader();
                                        videoBase64 = await new Promise((resolve) => {
                                            reader.onload = () => resolve(reader.result as string);
                                            reader.readAsDataURL(formData.videoBlob!);
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
                                        videoBlob: videoBase64,
                                        recordingTime: recordingTime
                                    }

                                    // Debug logging
                                    console.log('Submitting form data:', {
                                        ...submissionData,
                                        frontId: frontIdBase64 ? 'Present (converted to base64)' : 'Missing',
                                        backId: backIdBase64 ? 'Present (converted to base64)' : 'Missing',
                                        videoBlob: videoBase64 ? 'Present (converted to base64)' : 'Missing',
                                        recordingTime: recordingTime
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
                                        // Handle specific error cases
                                        if (response.status === 413) {
                                            throw new Error('Files are too large. Please reduce the size of your images and video, then try again.')
                                        }

                                        // Handle other error responses
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
                    <h1 className="text-3xl font-bold mb-2">Driver&apos;s License Verification</h1>
                    <p className="">Complete the steps below to verify your identity using your Driver&apos;s License</p>
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