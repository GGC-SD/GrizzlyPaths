import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart({ labels, values, title, onSliceClick }) {

  const COLORS = [
    "#007bff", "#28a745", "#dc3545", "#ffc107",
    "#6f42c1", "#fd7e14", "#20c997", "#e83e8c",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
    },

    // ENABLE CLICKING
    onClick: (evt, elements) => {
      if (!elements.length) return;
      const index = elements[0].index;
      if (onSliceClick) onSliceClick(index);
    },

    cutout: "50%",
  };

  return (
    <div style={{ width: "100%", maxWidth: 380, margin: "0 auto 10px" }}>
      <div style={{ width: "100%", aspectRatio: "1/1" }}>
        <Doughnut data={data} options={options} />
      </div>
      <h3 style={{ textAlign: "center", marginTop: 8 }}>{title}</h3>
    </div>
  );
}
