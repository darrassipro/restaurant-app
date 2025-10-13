// src/components/Admin/SalesChart.tsx
import { styled } from 'nativewind';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface SalesChartProps {
  data: { date: string; total: number }[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  const screenWidth = Dimensions.get('window').width - 40;
  
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };
  
  const chartData = {
    labels: data.map(item => {
      // Format date as DD/MM
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: data.map(item => item.total),
        color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: 8,
        }}
      />
    </View>
  );
};

export default styled(SalesChart);