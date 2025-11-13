import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MajorsChart({ majorId, setMajor }) {
  const MAJORS = [
    { id: "sw", label: "Software Development", color: "#6C63FF" },
    { id: "sec", label: "Cyber", color: "#E17055" },
    { id: "ds", label: "Data Science", color: "#3E8EFA" },
    { id: "dm", label: "Digital Media", color: "#A55EEA" },
    { id: "es", label: "Enterprise Systems", color: "#00B894" },
  ];

  const data = {
    labels: MAJORS.map((m) => m.label),
    datasets: [
      {
        label: "Majors",
        data: MAJORS.map(() => 1),
        backgroundColor: MAJORS.map((m) =>
          majorId === m.id ? m.color : `${m.color}66`
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
  responsive: true,       
  maintainAspectRatio: false,
  plugins: {
    legend:{ 
    diplay: true,
    position: 'bottom',
    },
  },
  onClick: (evt, elements) => {
    if(!elements.length) return;
    const index = elements[0].index;
    const id = MAJORS[index].id;
    setMajor(majorId == id ? null : id);
  },
  cutout: "50%",
};

  return <Doughnut data={data} options={options} />;
}
