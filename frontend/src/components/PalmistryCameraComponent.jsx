import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, RotateCw, CheckCircle, AlertCircle, Loader2, Hand } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

const PalmistryCameraComponent = ({ 
  onImageCapture, 
  onAnalysisComplete, 
  isAnalyzing = false,
  className = "" 
}) => {
  const { toast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front camera
  const [showTips, setShowTips] = useState(true);

  // Initialize camera stream
  const initializeCamera = useCallback(async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      console.log('Requesting camera access...');
      
      // Request camera permission with fallback constraints
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, max: 1920, min: 640 },
          height: { ideal: 720, max: 1080, min: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load before setting streaming state
        videoRef.current.onloadedmetadata = () => {
          console.log('Video loaded, starting playback');
          videoRef.current.play().then(() => {
            setIsStreaming(true);
            setHasPermission(true);
            console.log('Video is now playing');
          }).catch(playError => {
            console.error('Video play error:', playError);
            setHasPermission(false);
            toast({
              title: "Camera Error",
              description: "Unable to start video playback. Please try again.",
              variant: "destructive"
            });
          });
        };
        
        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error);
          setHasPermission(false);
        };
      }
      
    } catch (error) {
      console.error('Camera access error:', error);
      setHasPermission(false);
      
      let errorMessage = "Please allow camera access to scan your palm.";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Camera access was denied. Please allow camera permissions and refresh the page.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera found. Please ensure your device has a camera.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera is being used by another application. Please close other apps and try again.";
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = "Camera constraints not supported. Trying with basic settings...";
        
        // Try with simpler constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().then(() => {
                setIsStreaming(true);
                setHasPermission(true);
              });
            };
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback camera access failed:', fallbackError);
          errorMessage = "Camera access failed with basic settings. Please check your camera permissions.";
        }
      } else if (error.message.includes('not supported')) {
        errorMessage = "Camera access is not supported in this browser. Please try a different browser.";
      }
      
      toast({
        title: "Camera Access Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [facingMode, toast]);

  // Cleanup camera stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  // Switch between front and back camera
  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stopCamera]);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // Stop camera after capture
    stopCamera();
    
    // Notify parent component
    if (onImageCapture) {
      onImageCapture(imageData);
    }

    toast({
      title: "Photo Captured!",
      description: "Your palm image has been captured successfully.",
    });
  }, [onImageCapture, stopCamera, toast]);

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setCapturedImage(imageData);
      
      if (onImageCapture) {
        onImageCapture(imageData);
      }

      toast({
        title: "Image Uploaded!",
        description: "Your palm image has been uploaded successfully.",
      });
    };
    reader.readAsDataURL(file);
  }, [onImageCapture, toast]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    initializeCamera();
  }, [initializeCamera]);

  // Initialize camera on component mount
  useEffect(() => {
    if (!capturedImage) {
      initializeCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [facingMode]); // Re-run when camera switches

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (hasPermission === false) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Camera Access Needed</h3>
          <p className="text-gray-600 mb-4">
            We need camera access to scan your palm. Please allow camera permissions and refresh the page.
          </p>
          <div className="space-y-2">
            <Button onClick={initializeCamera} variant="outline" className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="default" 
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image Instead
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      {/* Tips Section */}
      {showTips && !capturedImage && (
        <Card className="mb-4 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Hand className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Palm Scanning Tips:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Hold your hand flat and steady</li>
                  <li>• Use good lighting, avoid shadows</li>
                  <li>• Fill most of the frame with your palm</li>
                  <li>• Keep fingers slightly apart</li>
                </ul>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 p-0 h-auto text-xs text-blue-600"
                  onClick={() => setShowTips(false)}
                >
                  Got it, hide tips
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Camera/Image Interface */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {!capturedImage ? (
            <div className="relative">
              {/* Camera Stream */}
              <div className="relative bg-black aspect-[4/3] overflow-hidden">
                {isStreaming ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Palm Guide Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-60 border-2 border-white/70 rounded-lg border-dashed flex items-center justify-center">
                        <Hand className="w-12 h-12 text-white/70" />
                      </div>
                    </div>
                    {/* Status Badge */}
                    <Badge className="absolute top-4 left-4 bg-green-600">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      Live
                    </Badge>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                    <span className="text-white ml-2">Starting camera...</span>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {isStreaming && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 px-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={switchCamera}
                    className="bg-white/90 hover:bg-white"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={capturePhoto}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Palm
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Captured Image Preview */
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured palm" 
                className="w-full h-auto max-h-96 object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Captured
              </Badge>
              
              {/* Image Controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 px-4">
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="bg-white/90 hover:bg-white"
                  disabled={isAnalyzing}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                
                {onAnalysisComplete && (
                  <Button
                    onClick={() => onAnalysisComplete(capturedImage)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Hand className="w-4 h-4 mr-2" />
                        Analyze Palm
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Hidden canvas for image capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
};

export default PalmistryCameraComponent;