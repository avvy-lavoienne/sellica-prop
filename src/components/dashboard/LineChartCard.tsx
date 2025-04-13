import ReactApexChart from 'react-apexcharts';

interface LineChartCardProps {
  title: string;
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
  className?: string;
}

export default function LineChartCard({ title, series, categories, className }: LineChartCardProps) {
  const options = {
    chart: {
      type: "line" as const,
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      fontFamily: "'Inter', sans-serif",
    },
    colors: [series[0].name === "Aktivitas SIAK" ? "#3B82F6" : "#F43F5E"],
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    grid: {
      borderColor: "rgba(209, 213, 219, 0.3)",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: categories,
      title: {
        text: "Bulan",
        style: {
          color: "#6B7280",
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Jumlah",
        style: {
          color: "#6B7280",
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      theme: "dark",
    },
    title: {
      text: title,
      align: "left" as const,
      style: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#1F2937",
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 8,
      },
    },
  };

  return (
    <div
      className={`bg-white rounded-xl transition-shadow duration-300 w-full ${className || ""}`}
    >
      <ReactApexChart options={options} series={series} type="line" height={250} />
    </div>
  );
}