import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Camera, Hand, Scan, Upload, RotateCcw, 
  CheckCircle, AlertCircle, Lightbulb, Eye 
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../hooks/use-toast';
import { SuperhumanOrb } from './SuperhumanTheme';

const PalmistryScanner = ({ onScanComplete, className = "" }) => {
  const { userSession } = useUser();
  const { toast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanTips, setScanTips] = useState(null);

  React.useEffect(() => {
    loadScanningTips();
    
    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const loadScanningTips = async () => {
    try {
      const response = await fetch('/api/palmistry/tips');
      const data = await response.json();
      
      if (data.success) {
        setScanTips(data.tips);
      }
    } catch (error) {
      console.error('Failed to load scanning tips:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Prefer back camera on mobile
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      toast({
        title: "Camera Access Failed",
        description: "Please allow camera access to scan your palm, or upload an image instead.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzePalm = async () => {
    if (!capturedImage || !userSession) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/palmistry/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_session: userSession,
          image_data: capturedImage
        })
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        toast({
          title: "Palm Analysis Complete!",
          description: "Your ancient wisdom has been revealed",
        });
        
        onScanComplete?.(data.analysis);
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Palm analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Please try again with a clearer image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    stopCamera();
  };

  return (
    <div className={`max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-amber-900">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
              <Hand className="h-6 w-6 text-white" />
            </div>
            <span>Palm Reading Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-800 leading-relaxed">
            Unlock the ancient wisdom encoded in your palms. Position your dominant hand 
            clearly in the camera view or upload a high-quality photo for analysis.
          </p>
        </CardContent>
      </Card>

      {/* Scanning Interface */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {!capturedImage ? (
            <div className="space-y-4 p-6">
              {/* Camera View */}
              {isCameraActive ? (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 md:h-80 object-cover"
                    playsInline
                    muted
                  />
                  
                  {/* Overlay Guide */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-amber-400 border-dashed rounded-lg w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                      <div className="text-amber-400 text-center">
                        <Hand className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Position your palm here</p>
                      </div>
                    </div>
                  </div>

                  {/* Capture Button */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      onClick={capturePhoto}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full w-16 h-16"
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                  <SuperhumanOrb size="medium" color="amber" />
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Ready to Scan Your Palm?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Choose how you'd like to capture your palm image
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Use Camera
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              )}

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Controls */}
              {isCameraActive && (
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Captured Image Preview */
            <div className="space-y-4 p-6">
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured palm"
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Captured
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={analyzePalm}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Scan className="mr-2 h-4 w-4 animate-spin" />
                      Reading Palm...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Analyze Palm
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={resetScan}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scanning Tips */}
      {scanTips && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Scanning Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-green-700">
                  ✓ For Best Results
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {scanTips.positioning?.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2 text-blue-700">
                  💡 Lighting Tips
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {scanTips.lighting?.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Entertainment Notice:</strong> Palm reading is for entertainment and spiritual 
          guidance purposes only. This analysis should not be used for making important life 
          decisions or medical diagnoses.
        </AlertDescription>
      </Alert>

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PalmistryScanner;