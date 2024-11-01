import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const apiUrls = [
  `/api/dashboard/all?week=1`,
  `/api/dashboard/all?week=2`,
  `/api/dashboard/all?week=3`,
  `/api/dashboard/all?week=4`,
  `/api/dashboard/all?week=5`,
  `/api/dashboard/all?week=6`,
  `/api/dashboard/all?week=7`,
  `/api/dashboard/all?week=8`,
  `/api/dashboard/all?week=9`,
  `/api/dashboard/all?week=10`,
  `/api/dashboard/all?week=11`,
  `/api/dashboard/all?week=12`,
  `/api/dashboard/all?week=13`,
  `/api/dashboard/all?week=14`,
];

const ClassapiUrls = [
  `/api/dashboard/classall?week=1`,
  `/api/dashboard/classall?week=2`,
  `/api/dashboard/classall?week=3`,
  `/api/dashboard/classall?week=4`,
  `/api/dashboard/classall?week=5`,
  `/api/dashboard/classall?week=6`,
  `/api/dashboard/classall?week=7`,
  `/api/dashboard/classall?week=8`,
  `/api/dashboard/classall?week=9`,
  `/api/dashboard/classall?week=10`,
  `/api/dashboard/classall?week=11`,
  `/api/dashboard/classall?week=12`,
  `/api/dashboard/classall?week=13`,
  `/api/dashboard/classall?week=14`,
];

const LineChart = () => {
  const [userScores, setUserScores] = useState([]);
  const [classAverageScores, setClassAverageScores] = useState([]);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem('jwt');
  useEffect(() => {
    const fetchData = async () => {
      const userScoresTemp = [];
      const classAverageScoresTemp = [];

      for (const url of apiUrls) {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          //   console.log(response.data);
          userScoresTemp.push(response.data.totalCorrect);
          //   classAverageScoresTemp.push(response.data.classAverageScore);
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          setError(`Error fetching data from ${url}: ${error.message}`);
          userScoresTemp.push(null);
          //   classAverageScoresTemp.push(null);
        }
      }
      for (const url of ClassapiUrls) {
        try {
          const response = await axios.get(url);
          //   console.log(response.data);
          // userScoresTemp.push(response.data.totalCorrect);
          classAverageScoresTemp.push(response.data.averageCorrect);
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          setError(`Error fetching data from ${url}: ${error.message}`);
          // userScoresTemp.push(null);
          classAverageScoresTemp.push(null);
        }
      }

      setUserScores(userScoresTemp);
      setClassAverageScores(classAverageScoresTemp);
    };

    fetchData();
  }, []);

  const data = {
    labels: apiUrls.map((url, index) => `Week ${index + 1}`),
    datasets: [
      {
        label: 'My Scores',
        data: userScores,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Class Average Scores',
        data: classAverageScores,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Scores',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
// // src/components/LineChart.js
// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // 註冊Chart.js的元件
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const LineChart = ({ data }) => {
//   const chartData = {
//     labels: data.weeks,
//     datasets: [
//       {
//         label: 'Total Correct',
//         data: data.totalCorrect,
//         fill: false,
//         backgroundColor: 'rgb(75, 192, 192)',
//         borderColor: 'rgba(75, 192, 192, 0.2)',
//       },
//       {
//         label: 'Total Wrong',
//         data: data.totalWrong,
//         fill: false,
//         backgroundColor: 'rgb(255, 99, 132)',
//         borderColor: 'rgba(255, 99, 132, 0.2)',
//       },
//       {
//         label: 'Total Unanswered',
//         data: data.totalUnanswered,
//         fill: false,
//         backgroundColor: 'rgb(255, 205, 86)',
//         borderColor: 'rgba(255, 205, 86, 0.2)',
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Weekly Quiz Performance',
//       },
//     },
//   };

//   return <Line data={chartData} options={options} />;
// };

// export default LineChart;
