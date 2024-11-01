import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Typography,
} from '@mui/material';
import { Button, Grid } from '@mui/material';
import Layout from '../layouts/Layout';
import axios from 'axios'; // 如果你使用axios，請確保已安裝
import { API_BASE_URL } from '../constants';

//要想辦法讓weekId可以動態變化
//使用者每次選擇不同的week，都會觸發一次API請求
//weekId是從網址上取得的

export default function DashboardDetailPage() {
  const navigate = useNavigate();
  // const [correctAnswers, setCorrectAnswers] = useState([]);
  const [weekStats, setWeekStats] = useState({
    countQ1: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ1AD: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ2: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ3: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ4: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    // correctCount: 0,
    // wrongCount: 0,
    // unansweredCount: 0,
    // roundedRatio: 0,
  });
  // 累積至這周的答題概況
  const [accumulativeStats, setACCumulativeStats] = useState({
    countQ1: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ1AD: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ2: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ3: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
    countQ4: { correct: 0, wrong: 0, unanswered: 0, ratio: '0' },
  });
  // const [selectedWeek, setSelectedWeek] = useState('');
  const { weekId, sectionId, questionId } = useParams();
  const [selectedWeek, setSelectedWeek] = useState(Number(weekId)); //預設為weekId
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const handleChange = (event) => {
    setSelectedWeek(event.target.value);
  };
  const [detailStats, setDetailStats] = useState({
    statusR1Q1: { correct: null, confidenceLevel: 0 },
    statusR1Q1AD: { correct: null, video: false, confidenceLevel: null },
    statusR1Q2: { correct: null, video: false, confidenceLevel: null },
    statusR1Q3: { correct: null, video: false, confidenceLevel: null },
    statusR1Q4: { correct: null, video: false, confidenceLevel: null },
    statusR2Q1: { correct: null, video: false, confidenceLevel: null },
    statusR2Q1AD: { correct: null, video: false, confidenceLevel: null },
    statusR2Q2: { correct: null, video: false, confidenceLevel: null },
    statusR2Q3: { correct: null, video: false, confidenceLevel: null },
    statusR2Q4: { correct: null, video: false, confidenceLevel: null },
    statusR3Q1: { correct: null, video: false, confidenceLevel: null },
    statusR3Q1AD: { correct: null, video: false, confidenceLevel: null },
    statusR3Q2: { correct: null, video: false, confidenceLevel: null },
    statusR3Q3: { correct: null, video: false, confidenceLevel: null },
    statusR3Q4: { correct: null, video: false, confidenceLevel: null },
  });
  //week
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
    setSelectedWeek(Number(weekNumber)); // 更新 selectedWeek 的值
    if (weekNumber === 15) {
      navigate(`/dashboard/all`);
    } else {
      navigate(`/dashboard/week/${weekNumber}`);
    }
  }

  
  //有沒有看影片
  const [video, setVideo] = useState({
    statusQ1AD: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
    statusQ2: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
    statusQ3: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
    statusQ4: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
  });
  //Q3答對有做Q4附加題
  const [Q3Points, setQ3Points] = useState({
    Q3correctR1: {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    },
    Q3correctR2: {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    },
    Q3correctR3: {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    },
  });
  // 累積至這周的影片
  const [accumulatedVideo, setAccumulatedVideo] = useState({
    statusQ1AD: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
    statusQ2: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
    statusQ3: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
    statusQ4: {
      totalcorrect: 0,
      totalcorrectunwatched: 0,
      totalwrong: 0,
      totalwrongunwatched: 0,
      totalunanswered: 0,
    },
  });
  // 累積至這周的Q3答對有做Q4附加題
  const [accumulatedQ3Points, setAccumulatedQ3Points] = useState({
    Q3correctR1: {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    },
    Q3correctR2: {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    },
    Q3correctR3: {
      Q3CorrectQ4Done: 0,
      Q3CorrectQ4NotDone: 0,
      Q3IncorrectQ4Done: 0,
      Q3IncorrectQ4NotDone: 0,
      Q3unanswered: 0,
    },
  });


  // weekstatus
  React.useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    // const API_DASHBOARD_URL = `${API_BASE_URL}/api/dashboard/dashboard?week=${weekId}`;
    const fetchWeeklyStats = async () => {
      try {
        // const response = await axios.get('/api/dashboard/weekstatus');
        const response = await axios.get(
          // `/api/dashboard/weekstatus?week=${selectedWeek}`
          `/api/dashboard/weekstatus?week=${weekId}`,
          // API_DASHBOARD_URL,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // setWeekStats(response.data); // 假設 API 回傳的數據結構與狀態相符
        setWeekStats({
          countQ1: response.data.countQ1,
          countQ1AD: response.data.countQ1AD,
          countQ2: response.data.countQ2,
          countQ3: response.data.countQ3,
          countQ4: response.data.countQ4,
        }); // 假設 API 回傳的數據結構與狀態相符
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      }
    };
    fetchWeeklyStats();
  }, [weekId]);

  // detailstatus
  React.useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    const fetchDetailStats = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/detailstatus?week=${weekId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);

        setDetailStats({
          statusR1Q1: response.data.statusR1Q1,
          statusR1Q1AD: response.data.statusR1Q1AD,
          statusR1Q2: response.data.statusR1Q2,
          statusR1Q3: response.data.statusR1Q3,
          statusR1Q4: response.data.statusR1Q4,
          statusR2Q1: response.data.statusR2Q1,
          statusR2Q1AD: response.data.statusR2Q1AD,
          statusR2Q2: response.data.statusR2Q2,
          statusR2Q3: response.data.statusR2Q3,
          statusR2Q4: response.data.statusR2Q4,
          statusR3Q1: response.data.statusR3Q1,
          statusR3Q1AD: response.data.statusR3Q1AD,
          statusR3Q2: response.data.statusR3Q2,
          statusR3Q3: response.data.statusR3Q3,
          statusR3Q4: response.data.statusR3Q4,
        });

        // setDetailStats(response.data);
      } catch (error) {
        console.error('Error fetching detail stats:', error);
      }
    };
    fetchDetailStats();
  }, [weekId]);
  const renderCorrect = (correct) => {
    let backgroundColor;
    if (correct === null) {
      backgroundColor = 'gray';
      // return 'N/A';
    } else if (correct === true) {
      backgroundColor = 'green';
      // return 'True';
    } else if (correct === false) {
      backgroundColor = 'red';
      // return 'False';
    }
    return (
      <span
        style={{
          display: 'inline-block',
          width: '40px',
          height: '20px',
          backgroundColor,
        }}
      />
    );
  };
  const renderVideo = (video) => {
    if (video === true) {
      return <span>&#10004;</span>; // 打勾的符號
    } else {
      return <span>&nbsp;&nbsp;&nbsp;</span>; // 空白
    }
  };
  const renderConfidenceLevel = (confidenceLevel) => {
    if (confidenceLevel === null) {
      return 'N/A';
    } else {
      return confidenceLevel;
    }
  };
  // video
  React.useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/video?week=${weekId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setVideo({
          statusQ1AD: response.data.statusQ1AD,
          statusQ2: response.data.statusQ2,
          statusQ3: response.data.statusQ3,
          statusQ4: response.data.statusQ4,
        });
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    fetchVideo();
  }, [weekId]);
  // Q3points
  React.useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    const fetchQ3Points = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/Q3points?week=${weekId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setQ3Points({
          Q3correctR1: response.data.Q3correctR1,
          Q3correctR2: response.data.Q3correctR2,
          Q3correctR3: response.data.Q3correctR3,
        });
      } catch (error) {
        console.error('Error fetching Q3 points:', error);
      }
    };
    fetchQ3Points();
  }, [weekId]);
  // accumulative status
  React.useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    const fetchAccumulatedStats = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/accstatus?week=${weekId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setACCumulativeStats({
          countQ1: response.data.countQ1,
          countQ1AD: response.data.countQ1AD,
          countQ2: response.data.countQ2,
          countQ3: response.data.countQ3,
          countQ4: response.data.countQ4,
        });
      } catch (error) {
        console.error('Error fetching accumulated stats:', error);
      }
    };
    fetchAccumulatedStats();
  }, [weekId]);
  // accumulative video
  React.useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    const fetchAccumulatedVideo = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/accvideo?week=${weekId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setAccumulatedVideo({
          statusQ1AD: response.data.statusQ1AD,
          statusQ2: response.data.statusQ2,
          statusQ3: response.data.statusQ3,
          statusQ4: response.data.statusQ4,
        });
      } catch (error) {
        console.error('Error fetching accumulated video:', error);
      }
    };
    fetchAccumulatedVideo();
  }, [weekId]);
  // accumulative Q3 points
  React.useEffect(() => {
    const token = sessionStorage.getItem('jwt');
    const fetchAccumulatedQ3Points = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/accQ3points?week=${weekId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setAccumulatedQ3Points({
          Q3correctR1: response.data.Q3correctR1,
          Q3correctR2: response.data.Q3correctR2,
          Q3correctR3: response.data.Q3correctR3,
        });
      } catch (error) {
        console.error('Error fetching accumulated Q3 points:', error);
      }
    };
    fetchAccumulatedQ3Points();
  }, [weekId]);
  const columnStyles = {
    week: { width: '10%' },
    Q1: { width: '15%' },
    Q1AD: { width: '15%' },
    Q2: { width: '15%' },
    Q3: { width: '15%' },
    Q4: { width: '15%' },
    confidence: { width: '15%' }, // Adjust accordingly if you have more columns
    video: { width: '15%' }, // Adjust accordingly if you have more columns
  };
  return (
    <Layout>
      {/* 周次 */}
      <Box>
        {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id='demo-simple-select-helper-label'>Week</InputLabel>
            <Select
              labelId='demo-simple-select-helper-label'
              id='demo-simple-select-helper'
              value={selectedWeek}
              label='Week'
              // onChange={handleChange}
              onChange={(event) => selectWeek(event.target.value)} // 在選項改變時觸發 selectWeek 函數
            >
              {weeks.map((week) => (
                <MenuItem key={week.value} value={week.value}>
                  {week.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div> */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id='demo-simple-select-helper-label'>Week</InputLabel>
          <Select
            labelId='demo-simple-select-helper-label'
            id='demo-simple-select-helper'
            value={selectedWeek} // 使用 selectedWeek 來顯示當前周次
            label='Week'
            onChange={(event) => {
              selectWeek(event.target.value)}} // 在選擇項改變時觸發 selectWeek
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
      {/* 這周概況 */}
      <Box
        sx={{
          paddingBottom: '1%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant='h6'
            sx={{
              width: '120px',
              border: '1px solid black',
              marginRight: '10px', // 添加右邊距
            }}
          >
            這周概況
          </Typography>
        </Box>
        <Box>
          <Typography variant='body1'>說明：答對/答錯/未答/正確率</Typography>
        </Box>
      </Box>
      {/* 整題答題情形 */}
      <Box sx={{ paddingBottom: '1%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center' style={columnStyles.week}>
                  週次
                </TableCell>
                <TableCell align='center' style={columnStyles.Q1}>
                  Q1
                </TableCell>
                <TableCell align='center' style={columnStyles.Q1AD}>
                  Q1AD
                </TableCell>
                <TableCell align='center' style={columnStyles.Q2}>
                  Q2
                </TableCell>
                <TableCell align='center' style={columnStyles.Q3}>
                  Q3
                </TableCell>
                <TableCell align='center' style={columnStyles.Q4}>
                  Q4
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>
                  {weeks.find((week) => week.value === selectedWeek)?.name}
                </TableCell>
                <TableCell align='center'>
                  {weekStats.countQ1.correct}/{weekStats.countQ1.wrong}/
                  {weekStats.countQ1.unanswered}/{weekStats.countQ1.ratio}%
                </TableCell>
                <TableCell align='center'>
                  {weekStats.countQ1AD.correct}/{weekStats.countQ1AD.wrong}/
                  {weekStats.countQ1AD.unanswered}/{weekStats.countQ1AD.ratio}%
                </TableCell>
                <TableCell align='center'>
                  {weekStats.countQ2.correct}/{weekStats.countQ2.wrong}/
                  {weekStats.countQ2.unanswered}/{weekStats.countQ2.ratio}%
                </TableCell>
                <TableCell align='center'>
                  {weekStats.countQ3.correct}/{weekStats.countQ3.wrong}/
                  {weekStats.countQ3.unanswered}/{weekStats.countQ3.ratio}%
                </TableCell>
                <TableCell align='center'>
                  {weekStats.countQ4.correct}/{weekStats.countQ4.wrong}/
                  {weekStats.countQ4.unanswered}/{weekStats.countQ4.ratio}%
                </TableCell>

              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* 詳細答題情形 */}
      <Box sx={{ paddingBottom: '1%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>回合</TableCell>
                <TableCell align='center'>Q1</TableCell>
                {/* <TableCell>是否看完影片</TableCell> */}
                <TableCell align='center'>自信度</TableCell>
                <TableCell align='center'>Q1ad</TableCell>
                <TableCell align='center'>是否看完影片</TableCell>
                <TableCell align='center'>自信度</TableCell>
                <TableCell align='center'>Q2</TableCell>
                <TableCell align='center'>是否看完影片</TableCell>
                <TableCell align='center'>自信度</TableCell>
                <TableCell align='center'>Q3</TableCell>
                <TableCell align='center'>是否看完影片</TableCell>
                <TableCell align='center'>自信度</TableCell>
                <TableCell align='center'>Q4</TableCell>
                <TableCell align='center'>是否看完影片</TableCell>
                <TableCell align='center'>自信度</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>R1</TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR1Q1.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR1Q1.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR1Q1AD.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR1Q1AD.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR1Q1AD.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR1Q2.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR1Q2.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR1Q2.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR1Q3.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR1Q3.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR1Q3.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR1Q4.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR1Q4.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR1Q4.confidenceLevel
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'>R2</TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR2Q1.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR2Q1.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR2Q1AD.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR2Q1AD.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR2Q1AD.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR2Q2.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR2Q2.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR2Q2.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR2Q3.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR2Q3.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR2Q3.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR2Q4.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR2Q4.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR2Q4.confidenceLevel
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell align='center'>R3</TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR3Q1.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR3Q1.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR3Q1AD.correct)}
                </TableCell>

                <TableCell align='center'>
                  {renderVideo(detailStats.statusR3Q1AD.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR3Q1AD.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR3Q2.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR3Q2.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR3Q2.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR3Q3.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR3Q3.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR3Q3.confidenceLevel
                  )}
                </TableCell>
                <TableCell align='center'>
                  {renderCorrect(detailStats.statusR3Q4.correct)}
                </TableCell>
                <TableCell align='center'>
                  {renderVideo(detailStats.statusR3Q4.video)}
                </TableCell>
                <TableCell align='center'>
                  {renderConfidenceLevel(
                    detailStats.statusR3Q4.confidenceLevel
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 整體評價 */}
      {/* 影片 */}
      <Box sx={{ paddingBottom: '1%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>題目</TableCell>
                <TableCell align='center'>答對有看影片</TableCell>
                <TableCell align='center'>
                  Q3答對有做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
                <TableCell align='center'>答對沒看影片</TableCell>
                <TableCell align='center'>
                  Q3答對沒做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
                <TableCell align='center'>答錯有看影片</TableCell>
                <TableCell align='center'>
                  Q3答錯有做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
                <TableCell align='center'>答錯沒看影片</TableCell>
                <TableCell align='center'>
                  Q3答錯沒做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>Q1AD</TableCell>
                <TableCell align='center'>
                  {video.statusQ1AD.totalcorrect}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ1AD.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ1AD.totalwrong}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ1AD.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                {/* <TableCell>0</TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell align='center'>Q2</TableCell>
                <TableCell align='center'>
                  {video.statusQ2.totalcorrect}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ2.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ2.totalwrong}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ2.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>

                {/* <TableSCell>0</TableSCell> */}
              </TableRow>
              <TableRow>
                <TableCell align='center'>Q3</TableCell>
                <TableCell align='center'>
                  {video.statusQ3.totalcorrect}
                </TableCell>
                <TableCell align='center'>
                  {Q3Points.Q3correctR1.Q3CorrectQ4Done}/
                  {Q3Points.Q3correctR2.Q3CorrectQ4Done}/
                  {Q3Points.Q3correctR3.Q3CorrectQ4Done}
                </TableCell>
                <TableCell align='center'>
                  {video.statusQ3.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'>
                  {Q3Points.Q3correctR1.Q3CorrectQ4NotDone}/
                  {Q3Points.Q3correctR2.Q3CorrectQ4NotDone}/
                  {Q3Points.Q3correctR3.Q3CorrectQ4NotDone}
                </TableCell>
                <TableCell align='center'>
                  {video.statusQ3.totalwrong}
                </TableCell>
                <TableCell align='center'>
                  {Q3Points.Q3correctR1.Q3IncorrectQ4Done}/
                  {Q3Points.Q3correctR2.Q3IncorrectQ4Done}/
                  {Q3Points.Q3correctR3.Q3IncorrectQ4Done}
                </TableCell>

                <TableCell align='center'>
                  {video.statusQ3.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'>
                  {Q3Points.Q3correctR1.Q3IncorrectQ4NotDone}/
                  {Q3Points.Q3correctR2.Q3IncorrectQ4NotDone}/
                  {Q3Points.Q3correctR3.Q3IncorrectQ4NotDone}
                </TableCell>

                {/* <TableCell>0</TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell align='center'>Q4</TableCell>
                <TableCell align='center'>
                  {video.statusQ4.totalcorrect}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ4.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ4.totalwrong}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {video.statusQ4.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                {/* <TableCell>0</TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* 累積至這周 */}
      <Box
        sx={{
          paddingBottom: '1%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant='h6'
            sx={{
              width: '120px',
              border: '1px solid black',
              marginRight: '10px', // 添加右邊距
            }}
          >
            累積至這周
          </Typography>
        </Box>
        <Box>
          <Typography variant='body1'>說明：答對/答錯/未答/正確率</Typography>
        </Box>
      </Box>

      <Box sx={{ paddingBottom: '1%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Q1</TableCell>
                {/* <TableCell>Q1AF</TableCell> */}
                <TableCell align='center'>Q1AD</TableCell>
                <TableCell align='center'>Q2</TableCell>
                <TableCell align='center'>Q3</TableCell>
                <TableCell align='center'>Q4</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>
                  {accumulativeStats.countQ1.correct}/
                  {accumulativeStats.countQ1.wrong}/
                  {accumulativeStats.countQ1.unanswered}/
                  {accumulativeStats.countQ1.ratio}%
                </TableCell>
                {/* <TableCell>{accumulativeStats.countQ1AD.correct}</TableCell> */}
                <TableCell align='center'>
                  {accumulativeStats.countQ1AD.correct}/
                  {accumulativeStats.countQ1AD.wrong}/
                  {accumulativeStats.countQ1AD.unanswered}/
                  {accumulativeStats.countQ1AD.ratio}%
                </TableCell>
                <TableCell align='center'>
                  {accumulativeStats.countQ2.correct}/
                  {accumulativeStats.countQ2.wrong}/
                  {accumulativeStats.countQ2.unanswered}/
                  {accumulativeStats.countQ2.ratio}%
                </TableCell>
                <TableCell align='center'>
                  {accumulativeStats.countQ3.correct}/
                  {accumulativeStats.countQ3.wrong}/
                  {accumulativeStats.countQ3.unanswered}/
                  {accumulativeStats.countQ3.ratio}%
                </TableCell>
                <TableCell align='center'>
                  {accumulativeStats.countQ4.correct}/
                  {accumulativeStats.countQ4.wrong}/
                  {accumulativeStats.countQ4.unanswered}/
                  {accumulativeStats.countQ4.ratio}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* 整體評價 */}
      {/* 影片 */}
      <Box sx={{ paddingBottom: '1%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>題目</TableCell>
                <TableCell align='center'>答對有看影片</TableCell>
                <TableCell align='center'>
                  Q3答對有做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
                <TableCell align='center'>答對沒看影片</TableCell>
                <TableCell align='center'>
                  Q3答對沒做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
                <TableCell align='center'>答錯有看影片</TableCell>
                <TableCell align='center'>
                  Q3答錯有做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
                <TableCell align='center'>答錯沒看影片</TableCell>
                <TableCell align='center'>
                  Q3答錯沒做Q4
                  <br />
                  R1/R2/R3
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>Q1AD</TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ1AD.totalcorrect}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ1AD.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ1AD.totalwrong}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ1AD.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'>Q2</TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ2.totalcorrect}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ2.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ2.totalwrong}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ2.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'>Q3</TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ3.totalcorrect}
                </TableCell>
                <TableCell align='center'>
                  {accumulatedQ3Points.Q3correctR1.Q3CorrectQ4Done}/
                  {accumulatedQ3Points.Q3correctR2.Q3CorrectQ4Done}/
                  {accumulatedQ3Points.Q3correctR3.Q3CorrectQ4Done}
                </TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ3.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'>
                  {accumulatedQ3Points.Q3correctR1.Q3CorrectQ4NotDone}/
                  {accumulatedQ3Points.Q3correctR2.Q3CorrectQ4NotDone}/
                  {accumulatedQ3Points.Q3correctR3.Q3CorrectQ4NotDone}
                </TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ3.totalwrong}
                </TableCell>
                <TableCell align='center'>
                  {accumulatedQ3Points.Q3correctR1.Q3IncorrectQ4Done}/
                  {accumulatedQ3Points.Q3correctR2.Q3IncorrectQ4Done}/
                  {accumulatedQ3Points.Q3correctR3.Q3IncorrectQ4Done}
                </TableCell>

                <TableCell align='center'>
                  {accumulatedVideo.statusQ3.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'>
                  {accumulatedQ3Points.Q3correctR1.Q3IncorrectQ4NotDone}/
                  {accumulatedQ3Points.Q3correctR2.Q3IncorrectQ4NotDone}/
                  {accumulatedQ3Points.Q3correctR3.Q3IncorrectQ4NotDone}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'>Q4</TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ4.totalcorrect}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ4.totalcorrectunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ4.totalwrong}
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  {accumulatedVideo.statusQ4.totalwrongunwatched}
                </TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
}