// Icon utilities to handle ad blocker issues
import { Shield, Lock, CheckCircle } from "lucide-react";

// Alternative icons for commonly blocked icons
export const getAlternativeIcon = (iconName: string) => {
  const alternatives: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    Fingerprint: Shield,
    fingerprint: Shield,
    Shield: Lock,
    shield: Lock,
  };

  return alternatives[iconName] || CheckCircle;
};
