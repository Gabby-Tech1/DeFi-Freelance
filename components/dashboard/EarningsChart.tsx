"use client";

import { ResponsiveLine } from '@nivo/line';

const data = [
  {
    id: 'earnings',
    data: [
      { x: 'Jan', y: 1200 },
      { x: 'Feb', y: 1800 },
      { x: 'Mar', y: 1500 },
      { x: 'Apr', y: 2200 },
      { x: 'May', y: 2800 },
      { x: 'Jun', y: 3200 },
    ],
  },
];

export default function EarningsChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: value => `$${value}`,
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.1}
        useMesh={true}
        colors={['#3B82F6']}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: '#6B7280',
              },
            },
          },
          grid: {
            line: {
              stroke: '#E5E7EB',
            },
          },
        }}
      />
    </div>
  );
} 