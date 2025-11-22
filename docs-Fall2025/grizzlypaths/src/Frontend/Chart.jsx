/**
 * Chart Component
 * ---------------------------
 * This component renders a customizable Doughnut chart using Chart.js.
 *
 * Props:
 * - labels: Array of label strings for each chart slice
 * - values: Array of numeric values for the chart
 * - title: Title displayed under the chart
 * - onSliceClick: Optional callback when a slice is clicked (returns slice index)
 *
 * Features:
 * - Auto-coloring of slices
 * - Responsive layout with fixed square ratio
 * - Slice click detection (interactive)
 */

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// Register the chart components so Chart.js knows what to render
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart({ labels, values, title, onSliceClick }) {

  const COLORS = [
    "#007bff", "#28a745", "#dc3545", "#ffc107",
    "#6f42c1", "#fd7e14", "#20c997", "#e83e8c",
  ];

  // Labels displayed around the chart
  const data = {
    labels,
    datasets: [
      {
        label: title, // What the dataset represents
        data: values,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]), // Assign colors
        borderWidth: 1,
      },
    ],
  };

  // Chart configuration settings
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
    },

    // Enable clicking a slice
    onClick: (evt, elements) => {
      if (!elements.length) return; // If click not on a slice, do nothing
      const index = elements[0].index; // Get clicked slice index
      if (onSliceClick) onSliceClick(index); // Send index back to parent component
    },

    cutout: "50%", // Controls hole size in middle of the doughnut
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



