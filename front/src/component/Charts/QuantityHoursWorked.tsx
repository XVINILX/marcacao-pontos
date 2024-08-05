import React from "react";
import ReactApexChart from "react-apexcharts";
import { formatMinutesToHoursAndMinutes } from "utils/formatTime";

export interface DataPoint {
  date: string;
  hours: number;
}

interface ChartProps {
  data: DataPoint[];
  totalMonth: number;
}

const ChartComponent: React.FC<ChartProps> = ({ data, totalMonth }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      foreColor: "#ffffff",
    },
    title: {
      text: "Horas trabalhadas",
      align: "left",
      style: {
        color: "#ffffff",
      },
    },
    xaxis: {
      categories: data.map((item) => item.date),
      title: {
        text: "Date",
        style: {
          color: "#ffffff",
        },
      },
    },
    yaxis: {
      min: 0,
      title: {
        text: "Hours",
        style: {
          color: "#ffffff",
        },
      },
      labels: {
        style: {
          colors: "#ffffff",
        },
        formatter: (value: number) => formatMinutesToHoursAndMinutes(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatMinutesToHoursAndMinutes(value),
      },
    },
  };

  const series = [
    {
      name: "Worked Hours",
      data: data.map((item) => item.hours),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          padding: "15px",
          borderRadius: "15px",
          backgroundColor: "white",
          color: "black",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4 style={{ margin: 0 }}>Horas totais</h4>
        {formatMinutesToHoursAndMinutes(totalMonth)}
      </div>
      <div>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
          width={400}
        />
      </div>
    </div>
  );
};

export default ChartComponent;
