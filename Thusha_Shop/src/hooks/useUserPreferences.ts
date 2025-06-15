
import { useState } from "react";
import { User, UserPreferences, FaceShape, VisionProblem } from "@/types/user";

export function useUserPreferences(user: User | null, updateUserCallback: (user: User) => void) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(
    user ? user.preferences || null : null
  );

  const setUserFaceShape = (shape: FaceShape) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          faceShape: shape,
        },
      };
      updateUserCallback(updatedUser);
    }
  };

  const setUserVisionProblem = (problem: VisionProblem) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          visionProblem: problem,
        },
      };
      updateUserCallback(updatedUser);
    }
  };

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...newPreferences,
        },
      };
      updateUserCallback(updatedUser);
    }
  };

  return {
    setUserFaceShape,
    setUserVisionProblem,
    updatePreferences,
  };
}
