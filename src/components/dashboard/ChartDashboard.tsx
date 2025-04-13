import LineChartCard from "./LineChartCard";

// Data dummy untuk Aktivitas SIAK
const siakData = {
  series: [
    {
      name: "Aktivitas SIAK",
      data: [120, 150, 180, 200, 170, 190],
    },
  ],
  categories: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
};

// Data dummy untuk Pengaduan Bulanan
const pengaduanData = {
  series: [
    {
      name: "Pengaduan Bulanan",
      data: [30, 45, 60, 50, 70, 65],
    },
  ],
  categories: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
};

export default function ChartDashboard() {
  return (
    <>
      <div className="max-w-sm h-80">
        <LineChartCard
          title="Aktivitas SIAK"
          series={siakData.series}
          categories={siakData.categories}
        />
      </div>
      <div className="max-w-sm h-80">
        <LineChartCard
          title="Pengaduan Bulanan"
          series={pengaduanData.series}
          categories={pengaduanData.categories}
        />
      </div>
    </>
  );
}