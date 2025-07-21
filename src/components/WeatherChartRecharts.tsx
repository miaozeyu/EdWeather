import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './WeatherChart.module.css';

interface WeatherDataPoint {
  day: string;
  maxTemp: number;
  minTemp: number;
}

interface WeatherChartProps {
  weatherData: {
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
  };
}

const WeatherChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
  // Prepare data for Recharts
  const chartData: WeatherDataPoint[] = weatherData.daily.time.map((date, index) => ({
    day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    maxTemp: Math.round(weatherData.daily.temperature_2m_max[index]),
    minTemp: Math.round(weatherData.daily.temperature_2m_min[index])
  }));

  // Calculate chart dimensions based on container
  const chartHeight = 500; // Doubled from previous size
  const chartAspect = 2; // Width to height ratio

  // Find min and max for Y axis
  const allTemps = [
    ...weatherData.daily.temperature_2m_max,
    ...weatherData.daily.temperature_2m_min
  ];
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  
  // Add some padding to the Y axis
  const yAxisPadding = 2;
  const yAxisDomain = [
    Math.floor(minTemp) - yAxisPadding,
    Math.ceil(maxTemp) + yAxisPadding
  ];

  return (
    <div className={styles.chartContainer} style={{ height: `${chartHeight}px` }}>
      <div className={styles.chart}>
        <div className={styles.chartSvgContainer}>
          <ResponsiveContainer width="100%" height="100%" aspect={chartAspect}>
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#7f8c8d' }}
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={yAxisDomain}
                tick={{ fill: '#7f8c8d' }}
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                width={40}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}°C`, name === 'maxTemp' ? 'High' : 'Low']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value: string) => value}
              />
              <Line
                type="monotone"
                dataKey="maxTemp"
                name="High"
                stroke="#ff6b6b"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, fill: '#ff6b6b' }}
                isAnimationActive={true}
                label={{
                  position: 'top',
                  formatter: (value: any) => `${value}°`,
                  fill: '#2c3e50',
                  fontSize: 12,
                  fontWeight: 600
                }}
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                name="Low"
                stroke="#4ecdc4"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, fill: '#4ecdc4' }}
                isAnimationActive={true}
                label={{
                  position: 'bottom',
                  formatter: (value: any) => `${value}°`,
                  fill: '#2c3e50',
                  fontSize: 12,
                  fontWeight: 600
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;
