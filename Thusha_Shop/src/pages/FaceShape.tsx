
// import React, { useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Camera, Upload, Check, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/components/ui/use-toast";
// import { useUser, FaceShape as FaceShapeType } from "@/context/UserContext";
// import { faceShapeGuide } from "@/data/products";
// import { motion } from "framer-motion";

// import { detectFaceShape } from "@/api/api";

// const FaceShapePage = () => {
//   const { user, setUserFaceShape } = useUser();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const [activeTab, setActiveTab] = useState("upload");
//   const [filePreview, setFilePreview] = useState<string | null>(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [analyzingFace, setAnalyzingFace] = useState(false);
//   const [faceShape, setFaceShape] = useState<FaceShapeType | null>(null);
//   const [showResults, setShowResults] = useState(false);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         setIsCameraActive(true);
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//       toast({
//         title: "Camera Access Error",
//         description: "Could not access your camera. Please check permissions or use the upload method.",
//         variant: "destructive",
//       });
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//       setIsCameraActive(false);
//     }
//   };

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       if (context) {
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const imageDataUrl = canvas.toDataURL("image/png");
//         setCapturedImage(imageDataUrl);
//         stopCamera();
//       }
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFilePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const resetCamera = () => {
//     setCapturedImage(null);
//     startCamera();
//   };

//   const resetUpload = () => {
//     setFilePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const analyzeImage = async () => {
//     const imageToAnalyze = capturedImage || filePreview;

//     if (!imageToAnalyze) {
//       toast({
//         title: "No Image Selected",
//         description: "Please upload or capture an image first.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setAnalyzingFace(true);

//     try {
//       const blob = await fetch(imageToAnalyze).then(res => res.blob());
//       const file = new File([blob], "face.png", { type: blob.type });

//       const result = await detectFaceShape(file); // Call backend API

//       // Normalize API response to lowercase to match FaceShape type
//       const normalizedShape = result.face_shape.toLowerCase() as FaceShapeType;

//       setFaceShape(normalizedShape);
//       setUserFaceShape(normalizedShape);
//       setShowResults(true);

//       toast({
//         title: "Analysis Complete",
//         description: `Your face shape appears to be ${normalizedShape}.`,
//       });
//     } catch (error) {
//       console.error("Error analyzing face shape:", error);
//       toast({
//         title: "Analysis Failed",
//         description: "There was a problem analyzing the image.",
//         variant: "destructive",
//       });
//     } finally {
//       setAnalyzingFace(false);
//     }
//   };

//  const viewRecommendations = () => {
//     if (faceShape) {
//       navigate(`/catalog?faceShape=${faceShape}`);
//     } else {
//       navigate("/catalog");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-2">Face Shape Analyzer</h1>
//       <p className="text-muted-foreground mb-8">
//         Find the perfect frames for your face shape. Upload a photo or use your camera
//         to analyze your face shape and get personalized recommendations.
//       </p>

//       {showResults ? (
//         <div className="max-w-4xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div className="bg-background rounded-lg shadow-md overflow-hidden">
//               <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-4 capitalize">
//                   Your Face Shape: {faceShape}
//                 </h2>
//                 <p className="mb-6">{faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.description}</p>

//                 <div className="mb-6">
//                   <h3 className="font-semibold mb-2">Characteristics</h3>
//                   <ul className="space-y-1 list-disc pl-5">
//                     {faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.characteristics.map((item, index) => (
//                       <li key={index}>{item}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="font-semibold mb-2">Recommended Frames</h3>
//                     <ul className="space-y-1 list-disc pl-5">
//                       {faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.recommendedFrames.map((item, index) => (
//                         <li key={index}>{item}</li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Frames to Avoid</h3>
//                     <ul className="space-y-1 list-disc pl-5">
//                       {faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.avoidFrames.map((item, index) => (
//                         <li key={index}>{item}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex gap-3">
//                   <Button onClick={viewRecommendations} className="flex items-center">
//                     View Recommended Frames <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" onClick={() => setShowResults(false)}>
//                     Analyze Again
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-secondary rounded-lg shadow-md overflow-hidden">
//               <div className="aspect-square relative">
//                 <img
//                   src={capturedImage || filePreview || faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.image}
//                   alt="Face shape example"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-12">
//             <h2 className="text-2xl font-bold mb-6">All Face Shape Types</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {Object.entries(faceShapeGuide).map(([shape, info]) => (
//                 <div 
//                   key={shape} 
//                   className={`bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
//                     shape === faceShape ? "ring-2 ring-primary" : ""
//                   }`}
//                 >
//                   <img src={info.image} alt={shape} className="w-30 h-30 object-cover" />
//                   <div className="p-4">
//                     <h3 className="font-semibold capitalize">{shape}</h3>
//                     <p className="text-sm mt-2">{info.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-md overflow-hidden">
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="w-full">
//               <TabsTrigger value="upload" className="flex-1">
//                 <Upload className=" mr-2 h-4 w-4" />
//                 Upload Photo
//               </TabsTrigger>
//               <TabsTrigger value="camera" className="flex-1">
//                 <Camera className=" mr-2 h-4 w-4" />
//                 Use Camera
//               </TabsTrigger>

//             </TabsList>

//             <TabsContent value="upload" className="p-6">
//               <div className="flex flex-col items-center gap-4">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   accept="image/*"
//                   className="hidden"
//                 />

//                 {filePreview ? (
//                   <div className="mb-6">
//                     <div className="relative w-full aspect-square max-w-md mx-auto mb-4 rounded-lg overflow-hidden">
//                     <img src={filePreview} alt="Uploaded" className="w-full h-full object-cover" />
//                   </div> 
//                     <div className="flex gap-3 items-center">
//                       <Button onClick={resetUpload} >Remove</Button>
//                       <Button onClick={analyzeImage}  disabled={analyzingFace}>
//                         {analyzingFace ? "Analyzing..." : "Analyze"}
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   // <Button onClick={handleUploadClick}>Select Photo</Button>
//                   <div
//                     onClick={handleUploadClick}
//                     className="border-2 border-dashed border-border rounded-lg p-8 mb-6 cursor-pointer hover:bg-accent transition-colors duration-200"
//                   >
//                     <div className="flex flex-col items-center">
//                       <Upload className="h-12 w-12 text-muted-foreground mb-4" />
//                       <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
//                       <p className="text-muted-foreground text-sm max-w-md mb-4">
//                         For best results, use a front-facing photo with your face clearly visible and
//                         hair pulled back from your face.
//                       </p>
//                       <Button>Select Image</Button>
//                     </div>
//                   </div>
//                 )}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//               </div>
//             </TabsContent>

//           <TabsContent value="camera">
//   <div className="flex flex-col items-center gap-4">


//     {/* Camera logic */}
//     {capturedImage ? (
//   <>

//       <img src={capturedImage} alt="Captured" className="max-w-xs mx-auto rounded-md mb-4" />
//       <div className="flex justify-center gap-3">
//         <Button onClick={resetCamera} variant="outline">Retake</Button>
//         <Button onClick={analyzeImage} disabled={analyzingFace}>
//           {analyzingFace ? "Analyzing..." : "Analyze"}
//         </Button>
//       </div>

//   </>
// ) : (
//   <div className="border-2 border-dashed border-border rounded-lg p-8 mb-6">
//     <div className="flex flex-col items-center">
//       <div className="flex flex-col items-center">
//         <Camera className="h-12 w-12 text-muted-foreground mb-4" />
//         <h3 className="text-lg font-medium mb-2">Use Your Camera</h3>
//         <p className="text-muted-foreground text-sm max-w-md mb-4">
//           For best results, use a front-facing photo with your face clearly visible and
//           hair pulled back from your face.
//         </p>
//       </div>
//       <video ref={videoRef} autoPlay muted playsInline className="rounded-md max-w-xs mx-auto mb-4" />
//       <canvas ref={canvasRef} className="hidden" />
//       {!isCameraActive ? (
//         <Button onClick={startCamera}>Start Camera</Button>
//       ) : (
//         <Button onClick={captureImage}>Capture</Button>
//       )}
//     </div>
//     <canvas ref={canvasRef} className="hidden" />
//   </div>
// )}

//   </div>
// </TabsContent>

//           </Tabs>
//                    <Separator />

//           <div className="p-6 bg-accent">
//              <h3 className="font-semibold mb-2">Tips for Best Results</h3>
//              <ul className="space-y-2">
//                <li className="flex items-start">
//                  <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
//                  Use a well-lit environment with even lighting on your face
//                </li>
//                <li className="flex items-start">
//                  <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
//                  Pull your hair back so your entire face is visible
//                </li>
//                <li className="flex items-start">
//                  <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
//                  Remove glasses and face the camera directly
//                </li>
//                <li className="flex items-start">
//                 <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
//                 Maintain a neutral expression (no smiling)
//                </li>
//              </ul>
//            </div>
//          </div>
//       )}
//     </div>
//   );
// };

// export default FaceShapePage;


import type React from "react"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Camera, Upload, Check, ArrowRight, Sparkles, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useUser, type FaceShape as FaceShapeType } from "@/context/UserContext"
import { faceShapeGuide } from "@/data/products"
import { motion } from "framer-motion"
import { detectFaceShape } from "@/api/api"

const FaceShapePage: React.FC = () => {
  const { user, setUserFaceShape } = useUser()
  const { toast } = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [activeTab, setActiveTab] = useState("upload")
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analyzingFace, setAnalyzingFace] = useState(false)
  const [faceShape, setFaceShape] = useState<FaceShapeType | null>(null)
  const [showResults, setShowResults] = useState(false)

  const startCamera = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera Access Error",
        description: "Could not access your camera. Please check permissions or use the upload method.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = (): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const captureImage = (): void => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const resetCamera = (): void => {
    setCapturedImage(null)
    startCamera()
  }

  const resetUpload = (): void => {
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeImage = async (): Promise<void> => {
    const imageToAnalyze = capturedImage || filePreview
    if (!imageToAnalyze) {
      toast({
        title: "No Image Selected",
        description: "Please upload or capture an image first.",
        variant: "destructive",
      })
      return
    }

    setAnalyzingFace(true)
    try {
      const blob = await fetch(imageToAnalyze).then((res) => res.blob())
      const file = new File([blob], "face.png", { type: blob.type })
      const result = await detectFaceShape(file)
      const normalizedShape = result.face_shape.toLowerCase() as FaceShapeType
      setFaceShape(normalizedShape)
      setUserFaceShape(normalizedShape)
      setShowResults(true)
      toast({
        title: "Analysis Complete",
        description: `Your face shape appears to be ${normalizedShape}.`,
      })
    } catch (error) {
      console.error("Error analyzing face shape:", error)
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing the image.",
        variant: "destructive",
      })
    } finally {
      setAnalyzingFace(false)
    }
  }

  const viewRecommendations = (): void => {
    if (faceShape) {
      navigate(`/catalog?faceShape=${faceShape}`)
    } else {
      navigate("/catalog")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-10 w-10 text-primary mr-4 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Face Shape Analyzer
            </h1>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Discover your unique face shape and find the perfect frames that complement your features with our
              AI-powered analysis.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-primary" />
                <span>Personalized</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </motion.div>

        {showResults ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {/* Celebration Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border-2 border-green-200 dark:border-green-800 rounded-full shadow-lg backdrop-blur-sm mb-6"
              >
                <div className="relative mr-4">
                  <Check className="h-8 w-8 text-green-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-green-700 dark:text-green-300 font-bold text-xl">✨ Analysis Complete! ✨</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-lg"
              >
                Your personalized face shape analysis is ready
              </motion.p>
            </div>

            {/* Enhanced Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {/* Main Results Card - Enhanced */}
              <div className="xl:col-span-3">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-gradient-to-br from-background via-background to-accent/5 rounded-3xl shadow-2xl border-2 border-primary/10 overflow-hidden backdrop-blur-sm"
                >
                  {/* Stunning Header */}
                  <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 border-b border-primary/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary"></div>
                    <div className="flex items-center mb-6">
                      <div className="relative mr-6">
                        <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/70 rounded-full animate-pulse shadow-lg"></div>
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-primary/30 rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold capitalize bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
                          Your Face Shape: {faceShape}
                        </h2>
                        <div className="flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 * i + 0.5 }}
                            >
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">Perfect Match</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {faceShape && faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.description}
                    </p>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Characteristics - Enhanced */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent rounded-2xl p-6 border border-accent/30 shadow-inner"
                    >
                      <h3 className="font-bold text-xl mb-6 flex items-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-primary to-primary/70 rounded-full mr-4 shadow-lg"></div>
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          Key Characteristics
                        </span>
                      </h3>
                      <div className="grid gap-4">
                        {faceShape &&
                          faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.characteristics.map(
                            (item: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index + 0.6, duration: 0.4 }}
                                className="flex items-start bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                              >
                                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 mr-4 mt-1 shadow-lg">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm leading-relaxed font-medium">{item}</span>
                              </motion.div>
                            ),
                          )}
                      </div>
                    </motion.div>

                    {/* Recommendations - Enhanced */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Recommended Frames */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/30 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl"></div>
                        <h3 className="font-bold text-xl mb-6 text-green-800 dark:text-green-200 flex items-center">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-2 mr-4 shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                          Perfect Matches
                        </h3>
                        <div className="space-y-4">
                          {faceShape &&
                            faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.recommendedFrames.map(
                              (item: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index + 0.8 }}
                                  className="flex items-start bg-white/60 dark:bg-green-900/20 rounded-lg p-3 border border-green-200/50 dark:border-green-700/50"
                                >
                                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3 mt-2 shadow-sm"></div>
                                  <span className="text-sm text-green-700 dark:text-green-300 leading-relaxed font-medium">
                                    {item}
                                  </span>
                                </motion.div>
                              ),
                            )}
                        </div>
                      </motion.div>

                      {/* Frames to Avoid */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="relative bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950/30 dark:via-rose-950/20 dark:to-pink-950/30 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-rose-500 rounded-t-2xl"></div>
                        <h3 className="font-bold text-xl mb-6 text-red-800 dark:text-red-200 flex items-center">
                          <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-full p-2 mr-4 shadow-lg">
                            <span className="text-white text-sm font-bold">×</span>
                          </div>
                          Avoid These
                        </h3>
                        <div className="space-y-4">
                          {faceShape &&
                            faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.avoidFrames.map(
                              (item: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index + 0.9 }}
                                  className="flex items-start bg-white/60 dark:bg-red-900/20 rounded-lg p-3 border border-red-200/50 dark:border-red-700/50"
                                >
                                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mr-3 mt-2 shadow-sm"></div>
                                  <span className="text-sm text-red-700 dark:text-red-300 leading-relaxed font-medium">
                                    {item}
                                  </span>
                                </motion.div>
                              ),
                            )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="flex flex-col sm:flex-row gap-6 pt-8"
                    >
                      <Button
                        onClick={viewRecommendations}
                        size="lg"
                        className="group flex-1 h-16 text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
                      >
                        <div className="flex items-center">
                          <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
                          <span>View Recommended Frames</span>
                          <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowResults(false)}
                        size="lg"
                        className="flex-1 h-16 text-lg font-bold border-3 border-primary/30 hover:border-primary/60 bg-gradient-to-r from-background to-accent/20 hover:from-accent/30 hover:to-accent/40 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-3"
                          >
                            <Sparkles className="h-5 w-5" />
                          </motion.div>
                          <span>Analyze Again</span>
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Image Display */}
              <div className="xl:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="bg-gradient-to-br from-background to-accent/10 rounded-3xl shadow-2xl border-2 border-primary/10 overflow-hidden h-fit backdrop-blur-sm"
                >
                  <div className="aspect-square relative group">
                    <img
                      src={
                        capturedImage ||
                        filePreview ||
                        (faceShape ? faceShapeGuide[faceShape as keyof typeof faceShapeGuide]?.image : undefined) ||
                        "/placeholder.svg?height=400&width=400"
                      }
                      alt="Your analyzed photo"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="bg-background/95 backdrop-blur-md rounded-2xl p-6 border-2 border-primary/20 shadow-2xl"
                      >
                        <p className="text-center font-bold capitalize text-xl mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {faceShape} Face Shape
                        </p>
                        <div className="flex justify-center mb-2">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1 * i + 1.4, type: "spring" }}
                              >
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">Perfect Analysis</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                
              </div>
            </div>

            {/* Rest of the results section remains the same... */}
            <div className="mt-12">
              <h2 className="text-4xl font-bold capitalize bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-8 mt-8 text-center gap-6">All Face Shape Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {Object.entries(faceShapeGuide).map(([shape, info]) => (
                  <div
                    key={shape}
                    className={`bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                      shape === faceShape ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={info.image || "/placeholder.svg?height=200&width=200"}
                      alt={shape}
                      className="w-[200px] h-[200px] object-cover mx-auto"
                    />
                    <div className="p-4">
                      {/* <h3 className="font-semibold capitalize">{shape}</h3> */}
                      <p className="text-sm mt-2">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-md overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="upload" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {filePreview ? (
                    <div className="mb-6">
                      <div className="relative w-full aspect-square max-w-md mx-auto mb-4 rounded-lg overflow-hidden">
                        <img
                          src={filePreview || "/placeholder.svg"}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-6 justify-center">
                        <Button
                          onClick={resetUpload}
                          variant="outline"
                          size="lg"
                          className="group h-14 px-8 text-base font-semibold border-2 border-red-200 hover:border-red-400 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 dark:from-red-950/20 dark:to-rose-950/20 dark:hover:from-red-950/40 dark:hover:to-rose-950/40 text-red-700 dark:text-red-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} className="mr-3">
                            <ArrowRight className="h-5 w-5 rotate-180" />
                          </motion.div>
                          <span>Remove Photo</span>
                        </Button>
                        <Button
                          onClick={analyzeImage}
                          disabled={analyzingFace}
                          size="lg"
                          className="group flex-1 h-14 px-10 text-base font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {analyzingFace ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                              <span>Analyzing Magic...</span>
                              <div className="ml-3 flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                              <span>Analyze Face Shape</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                className="ml-3"
                              >
                                <ArrowRight className="h-5 w-5" />
                              </motion.div>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={handleUploadClick}
                      className="border-2 border-dashed border-border rounded-lg p-8 mb-6 cursor-pointer hover:bg-accent transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
                        <p className="text-muted-foreground text-sm max-w-md mb-4">
                          For best results, use a front-facing photo with your face clearly visible and hair pulled back
                          from your face.
                        </p>
                        <Button>Select Image</Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="camera" className="p-6">
                <div className="flex flex-col items-center gap-4">
                  {capturedImage ? (
                    <>
                      <img
                        src={capturedImage || "/placeholder.svg"}
                        alt="Captured"
                        className="max-w-xs mx-auto rounded-md mb-4"
                      />
                      <div className="flex gap-6 justify-center">
                        <Button
                          onClick={resetCamera}
                          variant="outline"
                          size="lg"
                          className="group h-14 px-8 text-base font-semibold border-2 border-orange-200 hover:border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 dark:from-orange-950/20 dark:to-amber-950/20 dark:hover:from-orange-950/40 dark:hover:to-amber-950/40 text-orange-700 dark:text-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="mr-3">
                            <Camera className="h-5 w-5" />
                          </motion.div>
                          <span>Retake Photo</span>
                        </Button>
                        <Button
                          onClick={analyzeImage}
                          disabled={analyzingFace}
                          size="lg"
                          className="group flex-1 h-14 px-10 text-base font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {analyzingFace ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                              <span>Analyzing Magic...</span>
                              <div className="ml-3 flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                              <span>Analyze Face Shape</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                className="ml-3"
                              >
                                <ArrowRight className="h-5 w-5" />
                              </motion.div>
                            </div>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 mb-6">
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center">
                          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Use Your Camera</h3>
                          <p className="text-muted-foreground text-sm max-w-md mb-4">
                            For best results, use a front-facing photo with your face clearly visible and hair pulled
                            back from your face.
                          </p>
                        </div>
                        <video ref={videoRef} autoPlay muted playsInline className="rounded-md max-w-xs mx-auto mb-4" />
                        <canvas ref={canvasRef} className="hidden" />
                        {!isCameraActive ? (
                          <Button onClick={startCamera}>Start Camera</Button>
                        ) : (
                          <Button onClick={captureImage}>Capture</Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="p-6 bg-accent">
              <h3 className="font-semibold mb-2">Tips for Best Results</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
                  Use a well-lit environment with even lighting on your face
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
                  Pull your hair back so your entire face is visible
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
                  Remove glasses and face the camera directly
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-600 shrink-0" />
                  Maintain a neutral expression (no smiling)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Make sure to export as default
export default FaceShapePage
