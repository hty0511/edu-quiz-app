import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Button, Grid } from '@mui/material';
import Layout from '../layouts/Layout';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { API_BASE_URL } from '../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const DashboardAllPage = () => {
  const navigate = useNavigate();
  const [weekStats, setWeekStats] = useState({
    totalCorrect: 0,
    totalWrong: 0,
    totalUnanswered: 0,
    totalRatio: 0,
    totalQuestions: 0,
    totalAnswered: 0,
    totalAnsweredRatio: 0,
    totalUnansweredRatio: 0,
    correctRatio: 0,
    wrongRatio: 0,
  });
  const [selectedWeek, setSelectedWeek] = useState(15);
  const [userCorrectScores, setUserCorrectScores] = useState([]);
  const [userWrongScores, setUserWrongScores] = useState([]);
  const [userUnAnsweredScores, setUserUnAnsweredScores] = useState([]);
  const [userRatioScores, setUserRatioScores] = useState([]);
  const [classCorrectAverageScores, setClassCorrectAverageScores] = useState(
    []
  );
  const [classRatioAverageScores, setClassRatioAverageScores] = useState([]);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem('jwt');

  const weeks = [
    { name: '2月26日', value: 1 },
    { name: '3月4日', value: 2 },
    { name: '3月11日', value: 3 },
    { name: '3月18日', value: 4 },
    { name: '3月25日', value: 5 },
    { name: '4月1日', value: 6 },
    { name: '4月8日', value: 7 },
    { name: '4月22日', value: 8 },
    { name: '4月29日', value: 9 },
    { name: '5月6日', value: 10 },
    { name: '5月13日', value: 11 },
    { name: '5月20日', value: 12 },
    { name: '5月27日', value: 13 },
    { name: '6月3日', value: 14 },
    { name: '整體', value: 15 },
  ];

  function selectWeek(weekNumber) {
    setSelectedWeek(Number(weekNumber));
    navigate(`/dashboard/week/${weekNumber}`);
    if (weekNumber === 15) {
      navigate(`/dashboard/all`);
    }
  }

  const handleChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const response = await axios.get(`/api/dashboard/allstatus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWeekStats({
          totalCorrect: response.data.totalCorrect,
          totalWrong: response.data.totalWrong,
          totalUnanswered: response.data.totalUnanswered,
          totalRatio: response.data.totalRatio,
          totalQuestions: response.data.totalQuestions,
          totalAnswered: response.data.totalAnswered,
          totalAnsweredRatio: response.data.totalAnsweredRatio,
          totalUnansweredRatio: response.data.totalUnansweredRatio,
          correctRatio: response.data.correctRatio,
          wrongRatio: response.data.wrongRatio,
        });
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      }
    };
    fetchWeeklyStats();
  }, [token]);
  //答對答錯未達
  useEffect(() => {
    const fetchData = async () => {
      const userCorrectScoresTemp = [];
      const classCorrectAverageScoresTemp = [];
      const userWrongScoresTemp = [];
      // const classWrongAverageScoresTemp = [];
      const userUnAnsweredScoresTemp = [];
      const userRatioScoresTemp = [];
      const classRatioAverageScoresTemp = [];
      for (const url of apiUrls) {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          userCorrectScoresTemp.push(response.data.correctratio);
          userWrongScoresTemp.push(response.data.wrongratio);
          userUnAnsweredScoresTemp.push(response.data.unansweredratio);
          userRatioScoresTemp.push(response.data.totalRatio);
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          setError(`Error fetching data from ${url}: ${error.message}`);
          userCorrectScoresTemp.push(null);
          userWrongScoresTemp.push(null);
          userUnAnsweredScoresTemp.push(null);
          userRatioScoresTemp.push(null);
        }
      }

      for (const url of ClassapiUrls) {
        try {
          const response = await axios.get(url);
          classCorrectAverageScoresTemp.push(response.data.averageCorrect);
          classRatioAverageScoresTemp.push(response.data.averageCorrectRate);
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          setError(`Error fetching data from ${url}: ${error.message}`);
          classCorrectAverageScoresTemp.push(null);
          classRatioAverageScoresTemp.push(null);
        }
      }

      setUserCorrectScores(userCorrectScoresTemp);
      setClassCorrectAverageScores(classCorrectAverageScoresTemp);
      setUserWrongScores(userWrongScoresTemp);
      setUserUnAnsweredScores(userUnAnsweredScoresTemp);
      setUserRatioScores(userRatioScoresTemp);
      setClassRatioAverageScores(classRatioAverageScoresTemp);
    };

    fetchData();
  }, [token]);

  const correctWrongUnansweredData = {
    labels: weeks
      .filter((week) => week.name !== '整體')
      .map((week) => week.name),
    datasets: [
      {
        label: '答對比例',
        data: userCorrectScores,
        backgroundColor: 'rgb(75, 192, 192)', // 綠色
        stack: 'Stack 0',
      },
      {
        label: '答錯比例',
        data: userWrongScores,
        backgroundColor: 'rgb(255, 99, 132)', // 紅色
        stack: 'Stack 0',
      },
      {
        label: '未做比例',
        data: userUnAnsweredScores,
        backgroundColor: 'rgb(128, 128, 128)', // 灰色
        stack: 'Stack 0',
      },
    ],
  };

  const groupedCorrectRateData = {
    labels: weeks
      .filter((week) => week.name !== '整體')
      .map((week) => week.name),
    datasets: [
      {
        label: '我的正確率',
        data: userRatioScores,
        backgroundColor: 'rgb(54, 162, 235)', // 藍色
      },
      {
        label: '班級平均正確率',
        data: classRatioAverageScores,
        backgroundColor: 'rgb(255, 206, 86)', // 黃色
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        stacked: true, // Ensure x-axis is stacked
      },
      y: {
        stacked: true, // Ensure y-axis is stacked
        beginAtZero: true,
        max: 100, // Assuming you want to display percentages
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };
  const chartOptionsratio = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: 100, // Assuming you want to show percentages
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <Layout>
      <Box>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id='demo-simple-select-helper-label'>Week</InputLabel>
            <Select
              labelId='demo-simple-select-helper-label'
              id='demo-simple-select-helper'
              value={selectedWeek}
              label='Week'
              onChange={(event) => selectWeek(event.target.value)}
            >
              {weeks.map((week) => (
                <MenuItem key={week.value} value={week.value}>
                  {week.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
      {/* 整體情況表格 */}
      <Box
        sx={{
          paddingBottom: '2%',
          paddingTop: '2%',
          borderRadius: 0, // 確保邊框直角顯示
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 'none', // 移除陰影
            borderRadius: 0, // 確保容器是直角
            overflow: 'visible', // 讓內容溢出，避免被切掉
          }}
        >
          <Table sx={{ borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align='center'
                  sx={{
                    backgroundColor: '#e0f7fa',
                    border: '1px solid #000000',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  作答情況
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #000000',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  未作答情況
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  作答題數
                </TableCell>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  答對題數
                </TableCell>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  答錯題數
                </TableCell>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  未作答題數
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    textAlign: 'center',
                    padding: '8px',
                  }}
                >
                  {weekStats.totalAnswered}/{weekStats.totalQuestions} (
                  {weekStats.totalAnsweredRatio}%)
                </TableCell>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    textAlign: 'center',
                    padding: '8px',
                  }}
                >
                  {weekStats.totalCorrect}/{weekStats.totalAnswered} (
                  {weekStats.correctRatio}%)
                </TableCell>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    textAlign: 'center',
                    padding: '8px',
                  }}
                >
                  {weekStats.totalWrong}/{weekStats.totalAnswered} (
                  {weekStats.wrongRatio}%)
                </TableCell>
                <TableCell
                  sx={{
                    border: '1px solid #000000',
                    textAlign: 'center',
                    padding: '8px',
                  }}
                >
                  {weekStats.totalUnanswered}/{weekStats.totalQuestions} (
                  {weekStats.totalUnansweredRatio}%)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 長條圖 */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Box sx={{ paddingTop: '2%' }}>
            <Bar
              data={correctWrongUnansweredData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: '答對、答錯、未做比例' },
                },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ paddingTop: '2%' }}>
            <Bar
              data={groupedCorrectRateData}
              options={{
                ...chartOptionsratio,
                plugins: {
                  ...chartOptionsratio.plugins,
                  title: { display: true, text: '正確率' },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default DashboardAllPage;
