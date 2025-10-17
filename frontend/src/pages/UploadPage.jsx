import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { 
  Upload, 
  Camera, 
  Hand, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Handle demo mode
  React.useEffect(() => {
    if (isDemo) {
      // For demo, use a placeholder image or proceed directly to results
      handleDemoUpload();
    }
  }, [isDemo]);

  const handleDemoUpload = () => {
    // Create a demo image path and proceed to analysis
    setSelectedImage('/demo-palm.jpg'); // This would be a demo image
    setTimeout(() => {
      navigate('/analysis', { state: { image: '/demo-palm.jpg', isDemo: true } });
    }, 1000);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large", 
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    // Read and display the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      toast({
        title: "Image Selected!",
        description: "Your palm image is ready for analysis.",
      });
    };
    reader.readAsDataURL(file);
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera preferred
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraReady(true);
          setCameraError(null);
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      let errorMessage = "Unable to access camera. ";
      
      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow camera permissions.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No camera found on this device.";
      } else {
        errorMessage += "Please try uploading a file instead.";
      }
      
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setSelectedImage(imageData);
    setShowCamera(false);
    
    // Stop camera stream
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }

    toast({
      title: "Photo Captured!",
      description: "Your palm photo has been captured successfully.",
    });
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload or capture a palm image first.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Navigate to analysis page with the image
      navigate('/analysis', { 
        state: { 
          image: selectedImage,
          isDemo: isDemo
        } 
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  if (showCamera) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Capture Your Palm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {cameraError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Camera Error</h3>
                  <p className="text-red-700 mb-4">{cameraError}</p>
                  <Button 
                    onClick={() => setShowCamera(false)}
                    variant="outline"
                  >
                    Back to Upload
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => initializeCamera()}
                    />
                    {!isCameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button 
                      onClick={capturePhoto}
                      disabled={!isCameraReady}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Photo
                    </Button>
                    <Button 
                      onClick={() => setShowCamera(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Upload Your Palm Photo
          </h1>
          <p className="text-lg text-gray-600">
            {isDemo ? 'Viewing sample palm reading' : 'Take or upload a clear photo of your palm for AI analysis'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Upload Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload from Device</h3>
                <p className="text-gray-600 mb-4">
                  Select an existing photo from your device
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>

              <div className="text-center text-gray-400">or</div>

              {/* Camera Capture */}
              <div className="text-center">
                <Button 
                  onClick={() => {
                    setShowCamera(true);
                    initializeCamera();
                  }}
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo with Camera
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Preview & Tips */}
          <div className="space-y-6">
            {/* Image Preview */}
            {selectedImage ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Image Ready
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedImage} 
                      alt="Selected palm" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Hand className="w-4 h-4 mr-2" />
                        Analyze Palm
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Tips Card */
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">📸 Photo Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Hold your hand flat with palm facing up</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Use good lighting - avoid shadows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Make sure palm lines are clearly visible</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Keep fingers slightly apart</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Fill most of the frame with your palm</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;