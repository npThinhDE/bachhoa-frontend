import { useEffect } from "react";
import Layout from "../components/Layout";
import Chart from "chart.js/auto";

const Reports = () => {
  useEffect(() => {
    new Chart(document.getElementById("reportChart"), {
      type: "bar",
      data: {
        labels: ["T1", "T2", "T3", "T4"],
        datasets: [{ label: "Doanh thu (triệu)", data: [50, 80, 100, 120] }],
      },
    });
  }, []);

  return (
    <Layout>
      <h4>Thống kê & Báo cáo</h4>
      <canvas id="reportChart" height="100"></canvas>
    </Layout>
  );
};

export default Reports;
