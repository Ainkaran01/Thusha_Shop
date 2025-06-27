
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, ArrowRight, ArrowLeft, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";

const VisionTest = () => {
  const navigate = useNavigate();
  const { user, setUserVisionProblem } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<string | null>(null);

  const testSteps = [
    {
      id: "setup",
      title: "Test Setup Instructions",
      description: "Please follow these instructions carefully for accurate results",
      content: (
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This is a basic vision screening. For comprehensive eye care, please consult an eye care professional.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Before You Begin:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Sit approximately 2-3 feet (60-90 cm) away from your screen</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Ensure good lighting - avoid glare on your screen</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Remove glasses or contact lenses if you wear them</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Cover one eye at a time when instructed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Answer honestly about what you can see clearly</span>
              </li>
            </ul>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              If you experience eye pain, sudden vision changes, or discomfort during this test, stop immediately and consult an eye care professional.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: "distance",
      title: "Distance Vision Test",
      description: "Cover your left eye and look at the letters below with your right eye only",
      content: (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold">E</div>
            <div className="text-4xl font-bold">F P</div>
            <div className="text-2xl font-bold">T O Z</div>
            <div className="text-xl font-bold">L P E D</div>
            <div className="text-lg font-bold">D F C Z P</div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              <strong>Instructions:</strong> Cover your left eye completely with your hand. 
              Which is the smallest line you can read clearly with your right eye?
            </p>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 1 (largest E)")}
              >
                Line 1 - Large E only
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 2 (F P)")}
              >
                Line 2 - F P
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 3 (T O Z)")}
              >
                Line 3 - T O Z
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 4 (L P E D)")}
              >
                Line 4 - L P E D
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 5 (smallest)")}
              >
                Line 5 - D F C Z P (smallest)
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "distance-left",
      title: "Distance Vision Test - Left Eye",
      description: "Now cover your right eye and look at the letters with your left eye only",
      content: (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold">F</div>
            <div className="text-4xl font-bold">T O</div>
            <div className="text-2xl font-bold">L P E</div>
            <div className="text-xl font-bold">F D C Z</div>
            <div className="text-lg font-bold">F E L O P</div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              <strong>Instructions:</strong> Cover your right eye completely with your hand. 
              Which is the smallest line you can read clearly with your left eye?
            </p>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 1 (largest F)")}
              >
                Line 1 - Large F only
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 2 (T O)")}
              >
                Line 2 - T O
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 3 (L P E)")}
              >
                Line 3 - L P E
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 4 (F D C Z)")}
              >
                Line 4 - F D C Z
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Line 5 (smallest)")}
              >
                Line 5 - F E L O P (smallest)
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "near",
      title: "Near Vision Test",
      description: "Hold your device at normal reading distance and read the text below",
      content: (
        <div className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-background">
            <p className="text-base">
              The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.
            </p>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="text-xs">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              <strong>Instructions:</strong> Hold your device at comfortable reading distance (usually 14-16 inches). 
              Which paragraph can you read most comfortably?
            </p>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Large text only")}
              >
                Only the large paragraph is comfortable
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Medium text")}
              >
                Large and medium paragraphs are comfortable
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("All text sizes")}
              >
                All text sizes are comfortable to read
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleResponse("Text appears blurry")}
              >
                Text appears blurry or difficult to focus on
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "symptoms",
      title: "Vision Symptoms Assessment",
      description: "Tell us about any vision-related symptoms you experience",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select any symptoms you regularly experience (check all that apply):
          </p>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleResponse("No symptoms")}
            >
              No particular vision problems
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleResponse("Distant blurry")}
            >
              Distant objects appear blurry
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleResponse("Near blurry")}
            >
              Close objects are hard to focus on
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleResponse("Eye strain")}
            >
              Eye strain, especially when reading or using devices
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleResponse("Headaches")}
            >
              Frequent headaches after visual tasks
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleResponse("Night vision")}
            >
              Difficulty seeing at night or in low light
            </Button>
          </div>
        </div>
      )
    }
  ];

  const handleResponse = (response: string) => {
    const newResponses = [...responses, response];
    setResponses(newResponses);
    
    if (currentStep < testSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Analyze results
      analyzeResults(newResponses);
    }
  };

  const analyzeResults = (allResponses: string[]) => {
    let visionProblem = "unknown";
    let recommendations = "";

    // Simple analysis based on responses
    const distanceIssues = allResponses.some(r => r.includes("Line 1") || r.includes("largest"));
    const nearIssues = allResponses.some(r => r.includes("Large text only") || r.includes("blurry"));
    const hasSymptoms = allResponses.some(r => r.includes("blurry") || r.includes("strain") || r.includes("Headaches"));

    if (distanceIssues && nearIssues) {
      visionProblem = "presbyopia";
      recommendations = "You may have presbyopia (age-related vision changes). Consider progressive or bifocal lenses.";
    } else if (distanceIssues) {
      visionProblem = "nearsighted";
      recommendations = "You may be nearsighted (myopic). Distance vision correction may be helpful.";
    } else if (nearIssues || hasSymptoms) {
      visionProblem = "farsighted";
      recommendations = "You may be farsighted (hyperopic). Reading glasses or vision correction may help.";
    } else {
      visionProblem = "none";
      recommendations = "Your vision appears to be functioning well. Continue regular eye exams for optimal eye health.";
    }

    setTestResults(recommendations);
    
    // Update user's vision problem if logged in
    if (user) {
      setUserVisionProblem(visionProblem as any);
      toast({
        title: "Vision Assessment Complete",
        description: "Your vision profile has been updated based on the test results.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setResponses(responses.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setResponses([]);
    setTestResults(null);
  };

  if (testResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Vision Test Complete</CardTitle>
            <CardDescription>Here are your results and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {testResults}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Next Steps:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Schedule a comprehensive eye exam with an eye care professional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Browse our eyewear collection based on your vision needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Consider taking our face shape assessment for personalized frame recommendations</span>
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => navigate('/catalog')} className="flex-1">
                Browse Eyewear
              </Button>
              <Button variant="outline" onClick={() => navigate('/face-shape')} className="flex-1">
                Face Shape Test
              </Button>
              <Button variant="outline" onClick={handleRestart}>
                Retake Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Vision Assessment</h1>
          </div>
          <Progress value={(currentStep / (testSteps.length - 1)) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {testSteps.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{testSteps[currentStep].title}</CardTitle>
            <CardDescription>{testSteps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {testSteps[currentStep].content}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep === 0 && (
            <Button 
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2"
            >
              Start Test
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionTest;
