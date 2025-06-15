
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EyeglassRecommendationsProps {
  userFaceShape?: string;
  userVisionProblems?: string[];
}

const EyeglassRecommendations: React.FC<EyeglassRecommendationsProps> = ({
  userFaceShape,
  userVisionProblems = [],
}) => {
  const recommendations = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Blue Light Protection",
      description: "Perfect for digital device users",
      category: "Digital Eye Strain",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "UV Protection",
      description: "Essential for outdoor activities",
      category: "Sun Protection",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Lightweight Frames",
      description: "Comfortable for all-day wear",
      category: "Comfort",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Progressive Lenses",
      description: "Multiple vision corrections in one lens",
      category: "Presbyopia",
      color: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="p-2 rounded-full bg-primary/10">
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge variant="outline" className={rec.color}>
                    {rec.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {userFaceShape && userFaceShape !== "unknown" && (
          <div className="mt-4 p-3 bg-accent rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Face Shape Match:</span> We've filtered frames 
              that work best with your <span className="capitalize">{userFaceShape}</span> face shape.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EyeglassRecommendations;
