
interface BMIRecommendation {
  recommendedGoals: string[];
  explanation: string;
}

export const getBMIRecommendations = (bmi: number, goal?: string): BMIRecommendation => {
  let recommendedGoals: string[] = [];
  let explanation = '';

  if (bmi < 18.5) {
    // Underweight - recommend bulking plans
    recommendedGoals = ['bulking'];
    explanation = `With a BMI of ${bmi}, you're in the underweight category. We recommend high-calorie, nutrient-dense meal plans focused on healthy weight gain and muscle building.`;
  } else if (bmi >= 18.5 && bmi < 25) {
    // Normal weight - recommend maintenance plans, but consider user's goal
    if (goal === 'build muscle') {
      recommendedGoals = ['bulking'];
      explanation = `Your BMI of ${bmi} is in the healthy range. Since your goal is to build muscle, we recommend higher-calorie plans designed for lean muscle growth.`;
    } else if (goal === 'lose weight') {
      recommendedGoals = ['cutting'];
      explanation = `Your BMI of ${bmi} is in the healthy range, but since your goal is weight loss, we recommend moderate calorie deficit plans for lean body composition.`;
    } else {
      recommendedGoals = ['maintenance'];
      explanation = `Great! Your BMI of ${bmi} is in the healthy range. We recommend balanced meal plans to maintain your current weight while supporting an active lifestyle.`;
    }
  } else if (bmi >= 25 && bmi < 30) {
    // Overweight - recommend cutting plans
    recommendedGoals = ['cutting'];
    explanation = `With a BMI of ${bmi}, you're in the overweight category. We recommend calorie-controlled meal plans designed to support healthy weight loss while preserving muscle mass.`;
  } else {
    // Obese - recommend cutting plans with emphasis on health
    recommendedGoals = ['cutting'];
    explanation = `With a BMI of ${bmi}, we strongly recommend consulting with a healthcare provider. Our cutting meal plans can support healthy weight loss as part of a comprehensive health plan.`;
  }

  return { recommendedGoals, explanation };
};
