export type RiskFactor = {
    message: string;
    points: number;
    type: "positive" | "negative";
};

export const calculateRiskScoreDetailed = (tx: { amount: number; step: number; isNewRecipient: boolean }) => {
    let score = 0;
    const factors: RiskFactor[] = [];
    
    // Fix: Define hourOfDay using the modulo operator
    const hourOfDay = tx.step % 24;

    // 1. Time Check
    if (hourOfDay >= 0 && hourOfDay <= 6) {
        score += 35;
        factors.push({ message: "Late Night Transaction (12AM-6AM)", points: 35, type: "negative" });
    } else {
        factors.push({ message: "Standard Operating Hours", points: 0, type: "positive" });
    }

    // 2. Recipient Check
    if (tx.isNewRecipient) {
        score += 40;
        factors.push({ message: "New Recipient/Merchant", points: 40, type: "negative" });
    } else {
        factors.push({ message: "Known/Verified Merchant", points: 0, type: "positive" });
    }
    
    // 3. Amount/Outlier Check
    if (tx.amount > 100000 && !tx.isNewRecipient) {
        score -= 15;
        factors.push({ message: "High Value to Trusted Merchant", points: -15, type: "positive" });
    }

    // Determine Label and Color
    const totalScore = Math.min(Math.max(score, 0), 100);
    let label = "Low Risk / Outlier";
    let color = "text-green-400";

    if (totalScore > 30 && totalScore <= 65) {
        label = "Moderate Risk";
        color = "text-yellow-400";
    } else if (totalScore > 65) {
        label = "High Risk / Likely Fraud";
        color = "text-red-500";
    }

    return {
        totalScore,
        factors,
        label,
        color
    };
};
