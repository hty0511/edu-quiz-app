import React from "react";
import Layout from "../layouts/Layout";
import { Typography, Card, CardContent, FormControl, Select, MenuItem, Button, Alert, Box } from '@mui/material';
import axios from "axios";
import { API_BASE_URL } from "../constants";

export default function SystemControlPage() {
  const [week, setWeek] = React.useState('');
  const [round, setRound] = React.useState('');
  const [Q3Open, setQ3Open] = React.useState('');
  const [Q4Open, setQ4Open] = React.useState('');
  const [weekAlert, setWeekAlert] = React.useState({ show: false, message: '', severity: '' });
  const [roundAlert, setRoundAlert] = React.useState({ show: false, message: '', severity: '' });
  const [Q3OpenAlert, setQ3OpenAlert] = React.useState({ show: false, message: '', severity: '' });
  const [Q4OpenAlert, setQ4OpenAlert] = React.useState({ show: false, message: '', severity: '' });
  const [finished, setFinished] = React.useState(null);

  const API_GLOBAL_SETTING_URL = `${API_BASE_URL}/api/global-setting`;
  const API_CHECK_FINISHED_URL = `${API_BASE_URL}/api/cpp-quizzes/progresses/check-finished`;

  const handleWeekChange = (event) => {
    setWeek(event.target.value);
  };

  const handleWeekEdit = () => {
    const token = sessionStorage.getItem("jwt");

    if (week === '') {
      setWeekAlert({ show: true, message: '請選擇周次！', severity: 'warning' });
      return;
    }

    axios
      .patch(
        API_GLOBAL_SETTING_URL,
        {
          week: week
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        setWeekAlert({ show: true, message: '修改成功！', severity: 'success' });
      })
      .catch((err) => {
        setWeekAlert({ show: true, message: '修改失敗！', severity: 'error' });
      });
  };

  const handleCloseWeekAlert = () => {
    setWeekAlert({ ...weekAlert, show: false });
  };

  const handleRoundChange = (event) => {
    setRound(event.target.value);
  };

  const handleRoundEdit = () => {
    const token = sessionStorage.getItem("jwt");

    if (round === '') {
      setRoundAlert({ show: true, message: '請選擇作答開放！', severity: 'warning' });
      return;
    }

    axios
      .patch(
        API_GLOBAL_SETTING_URL,
        {
          roundStatus: round
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        setRoundAlert({ show: true, message: '修改成功！', severity: 'success' });
      })
      .catch((err) => {
        setRoundAlert({ show: true, message: '修改失敗！', severity: 'error' });
      });
  };

  const handleCloseRoundAlert = () => {
    setRoundAlert({ ...roundAlert, show: false });
  };

  const handleQ3OpenChange = (event) => {
    setQ3Open(event.target.value);
  };

  const handleQ3OpenEdit = () => {
    const token = sessionStorage.getItem("jwt");

    if (Q3Open === '') {
      setQ3OpenAlert({ show: true, message: '請選擇Q3開放！', severity: 'warning' });
      return;
    }

    axios
      .patch(
        API_GLOBAL_SETTING_URL,
        {
          thirdQuestionStatus: Q3Open
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        setQ3OpenAlert({ show: true, message: '修改成功！', severity: 'success' });
      })
      .catch((err) => {
        setQ3OpenAlert({ show: true, message: '修改失敗！', severity: 'error' });
      });
  };

  const handleCloseQ3OpenAlert = () => {
    setQ3OpenAlert({ ...Q3OpenAlert, show: false });
  };

  const handleQ4OpenChange = (event) => {
    setQ4Open(event.target.value);
  };

  const handleQ4OpenEdit = () => {
    const token = sessionStorage.getItem("jwt");

    if (Q4Open === '') {
      setQ4OpenAlert({ show: true, message: '請選擇Q4開放！', severity: 'warning' });
      return;
    }

    axios
      .patch(
        API_GLOBAL_SETTING_URL,
        {
          postLessonPracticeEnabled: Q4Open
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        setQ4OpenAlert({ show: true, message: '修改成功！', severity: 'success' });
      })
      .catch((err) => {
        setQ4OpenAlert({ show: true, message: '修改失敗！', severity: 'error' });
      });
  };

  const handleCloseQ4OpenAlert = () => {
    setQ4OpenAlert({ ...Q4OpenAlert, show: false });
  };

  const handleCheckFinished = () => {
    const token = sessionStorage.getItem("jwt");

    axios
      .get(API_CHECK_FINISHED_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setFinished(response.data);
      })
      .catch((err) => {

      });
  };

  return (
    <Layout>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            系統控制
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Box sx={{ fontWeight: 'bold' }}>修改系統周次:</Box>
            <FormControl size="small">
              <Select value={week} onChange={handleWeekChange} displayEmpty>
                <MenuItem value={1}>02/26</MenuItem>
                <MenuItem value={2}>03/04</MenuItem>
                <MenuItem value={3}>03/11</MenuItem>
                <MenuItem value={4}>03/18</MenuItem>
                <MenuItem value={5}>03/25</MenuItem>
                <MenuItem value={6}>04/01</MenuItem>
                <MenuItem value={7}>04/08</MenuItem>
                <MenuItem value={8}>04/22</MenuItem>
                <MenuItem value={9}>04/29</MenuItem>
                <MenuItem value={10}>05/06</MenuItem>
                <MenuItem value={11}>05/13</MenuItem>
                <MenuItem value={12}>05/20</MenuItem>
                <MenuItem value={13}>05/27</MenuItem>
                <MenuItem value={14}>06/03</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleWeekEdit}>修改</Button>
            {weekAlert.show && (
              <Alert severity={weekAlert.severity} onClose={handleCloseWeekAlert}>{weekAlert.message}</Alert>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontWeight: 'bold' }}>修改作答開放到:</Box>
            <FormControl size="small">
              <Select value={round} onChange={handleRoundChange} displayEmpty>
                <MenuItem value={0}>不開放</MenuItem>
                <MenuItem value={1}>第一節</MenuItem>
                <MenuItem value={2}>第二節</MenuItem>
                <MenuItem value={3}>第三節</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleRoundEdit}>修改</Button>
            {roundAlert.show && (
              <Alert severity={roundAlert.severity} onClose={handleCloseRoundAlert}>{roundAlert.message}</Alert>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontWeight: 'bold' }}>修改Q3開放到:</Box>
            <FormControl size="small">
              <Select value={Q3Open} onChange={handleQ3OpenChange} displayEmpty>
                <MenuItem value={0}>不開放</MenuItem>
                <MenuItem value={1}>第一節</MenuItem>
                <MenuItem value={2}>第二節</MenuItem>
                <MenuItem value={3}>第三節</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleQ3OpenEdit}>修改</Button>
            {Q3OpenAlert.show && (
              <Alert severity={Q3OpenAlert.severity} onClose={handleCloseQ3OpenAlert}>{Q3OpenAlert.message}</Alert>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontWeight: 'bold' }}>修改Q4開放:</Box>
            <FormControl size="small">
              <Select value={Q4Open} onChange={handleQ4OpenChange} displayEmpty>
                <MenuItem value={false}>不開放</MenuItem>
                <MenuItem value={true}>開放</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleQ4OpenEdit}>修改</Button>
            {Q4OpenAlert.show && (
              <Alert severity={Q4OpenAlert.severity} onClose={handleCloseQ4OpenAlert}>{Q4OpenAlert.message}</Alert>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 6 }}>
            <Box sx={{ fontWeight: 'bold' }}>學生作答進度:</Box>
            <Button variant="contained" onClick={handleCheckFinished}>查詢</Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ fontWeight: 'bold' }}>Q1完成人數:</Box>
              {finished && <Typography sx={{ color: 'red' }}>{finished.q1Finished}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ fontWeight: 'bold' }}>Q1ad完成人數:</Box>
              {finished && <Typography sx={{ color: 'red' }}>{finished.q1adFinished}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ fontWeight: 'bold' }}>Q2完成人數:</Box>
              {finished && <Typography sx={{ color: 'red' }}>{finished.q2Finished}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ fontWeight: 'bold' }}>Q3完成人數:</Box>
              {finished && <Typography sx={{ color: 'red' }}>{finished.q3Finished}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ fontWeight: 'bold' }}>Q4完成人數:</Box>
              {finished && <Typography sx={{ color: 'red' }}>{finished.q4Finished}</Typography>}
            </Box>
          </Box>

        </CardContent>
      </Card>
    </Layout>
  );
}
