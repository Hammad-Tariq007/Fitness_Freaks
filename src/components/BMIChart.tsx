
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface BMIChartProps {
  bmi: number;
  category: string;
  categoryColor: string;
}

export const BMIChart: React.FC<BMIChartProps> = ({ bmi, category, categoryColor }) => {
  // Calculate the percentage based on BMI (normalized to 0-100 scale)
  const maxBMI = 40; // Maximum BMI for chart scale
  const percentage = Math.min((bmi / maxBMI) * 100, 100);

  // Determine chart color based on BMI category
  const getChartColor = () => {
    if (bmi < 18.5) return '#3B82F6'; // Blue for underweight
    if (bmi < 25) return '#10B981'; // Green for normal
    if (bmi < 30) return '#F59E0B'; // Yellow for overweight
    return '#EF4444'; // Red for obese
  };

  const chartData = [
    {
      name: 'BMI',
      value: percentage,
      fill: getChartColor(),
    },
  ];

  const chartConfig = {
    value: {
      label: 'BMI Value',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Your BMI Result
        </h3>
      </div>

      <div className="relative">
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill={getChartColor()}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={false}
            />
          </RadialBarChart>
        </ChartContainer>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {bmi}
            </div>
            <div className={`text-sm font-medium ${categoryColor}`}>
              {category}
            </div>
          </motion.div>
        </div>
      </div>

      {/* BMI Scale Legend */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>BMI Categories:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Under 18.5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">18.5-24.9</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600 dark:text-gray-400">25-29.9</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">30+</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
