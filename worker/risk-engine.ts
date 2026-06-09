import { RtoRisk } from "@shared/types";
export interface RiskResult {
  risk: RtoRisk;
  recommendation: string;
}
/**
 * RTO Risk Prediction Logic
 * Evaluates multiple factors to determine the probability of a return-to-origin.
 */
export function calculateRtoRisk(
  amount: number,
  trustScore: number,
  pincodeRtoRate: number
): RiskResult {
  // Logic: High Risk if trustScore < 30 OR pincodeRtoRate > 20%
  if (trustScore < 30 || pincodeRtoRate > 20) {
    return {
      risk: 'high',
      recommendation: amount > 2000 
        ? "High value risk. Disable COD or confirm via WhatsApp/Call." 
        : "Confirm order via IVR or WhatsApp before shipping."
    };
  }
  // Logic: Medium Risk if trustScore < 60 OR pincodeRtoRate > 12%
  if (trustScore < 60 || pincodeRtoRate > 12) {
    return {
      risk: 'medium',
      recommendation: "Verify address accuracy. Consider priority shipping."
    };
  }
  // Logic: Low Risk otherwise
  return {
    risk: 'low',
    recommendation: "Ship normally. Trusted profile and safe zone."
  };
}