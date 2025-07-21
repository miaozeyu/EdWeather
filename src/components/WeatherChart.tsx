import React from 'react';
import { WeatherResponse } from '../types/weather';
import styles from './WeatherChart.module.css';

interface WeatherChartProps {
  weatherData: WeatherResponse;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
    // Calculate temperature range and chart dimensions
  const maxTemp = Math.max(...weatherData.daily.temperature_2m_max);
  const minTemp = Math.min(...weatherData.daily.temperature_2m_min);
  const tempRange = maxTemp - minTemp || 1; // Prevent division by zero
  const numDays = weatherData.daily.time.length;


  
  // Chart dimensions with padding
  const chartPadding = 6; // Reduced padding for more space
  const chartWidth = 100 - (chartPadding * 2);
  const chartHeight = 70; // Balanced height for good proportions
  
  // Calculate point spacing based on number of days
  const pointSpacing = numDays > 1 ? chartWidth / (numDays - 1) : 0;
  
  // Calculate x positions with padding
  const getXPosition = (index: number) => {
    return chartPadding + (index * pointSpacing);
  };
  
  // Calculate Y position for a given temperature
  const getYPosition = (temp: number) => {
    const verticalPadding = 12; // Reduced padding to use more vertical space
    const chartAreaHeight = chartHeight - (verticalPadding * 2);
    return verticalPadding + ((maxTemp - temp) / tempRange) * chartAreaHeight;
  };
  
  // Calculate data points with proper spacing and bounds checking
  const maxPoints = weatherData.daily.temperature_2m_max
    .map((temp, index) => {
      const x = getXPosition(index);
      const y = getYPosition(temp);
      return {
        x: x,
        y: y,
        temp: Math.round(temp),
        // Position label above the point with bounds checking
        labelY: Math.max(10, y - 6)
      };
    });

  const minPoints = weatherData.daily.temperature_2m_min
    .map((temp, index) => {
      const x = getXPosition(index);
      const y = getYPosition(temp);
      return {
        x: x,
        y: y,
        temp: Math.round(temp),
        // Position label below the point with bounds checking
        labelY: Math.min(chartHeight - 5, y + 8)
      };
    });
    
  // Generate SVG paths for the temperature lines
  const maxPath = `M ${maxPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const minPath = `M ${minPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  // These variables are already declared above, so we don't need to declare them again

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>Daily Temperature Range</div>
      <div className={styles.chart}>
        <div className={styles.chartSvgContainer}>
          <svg 
            viewBox={`0 0 100 ${chartHeight + 20}`} 
            className={styles.svg} 
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines with border */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect 
              x={chartPadding} 
              y="12" 
              width={chartWidth} 
              height={chartHeight - 14} 
              fill="url(#grid)" 
              stroke="#e0e0e0"
              strokeWidth="0.5"
              rx="2"
              ry="2"
            />
            
            {/* Temperature lines */}
            <path
              d={maxPath}
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="1.5"
              className={styles.maxTempLine}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={minPath}
              fill="none"
              stroke="#4ecdc4"
              strokeWidth="1.5"
              className={styles.minTempLine}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {maxPoints.map((point, index) => (
              <g key={`max-${index}`} className={styles.dataPointGroup}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="1.2"
                  fill="#ff6b6b"
                  className={styles.dataPoint}
                  stroke="white"
                  strokeWidth="0.5"
                />
                <text
                  x={point.x}
                  y={point.labelY}
                  textAnchor="middle"
                  className={styles.tempLabel}
                  fontSize="3.2"
                  fontWeight="600"
                  dominantBaseline="middle"
                >
                  {point.temp}°
                </text>
              </g>
            ))}
            
            {minPoints.map((point, index) => (
              <g key={`min-${index}`} className={styles.dataPointGroup}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="1.2"
                  fill="#4ecdc4"
                  className={styles.dataPoint}
                  stroke="white"
                  strokeWidth="0.5"
                />
                <text
                  x={point.x}
                  y={point.labelY}
                  textAnchor="middle"
                  className={styles.tempLabel}
                  fontSize="3.2"
                  fontWeight="600"
                  dominantBaseline="middle"
                >
                  {point.temp}°
                </text>
              </g>
            ))}
            
            {/* X-axis labels */}
            {weatherData.daily.time.map((date, index) => {
              const xPos = getXPosition(index);
              return (
                <text
                  key={date}
                  x={xPos}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  className={styles.axisLabel}
                  fontSize="2.8"
                >
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#ff6b6b' }}></span>
          <span>Daily High</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#4ecdc4' }}></span>
          <span>Daily Low</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;
