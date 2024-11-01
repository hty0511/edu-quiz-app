import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Layout from '../layouts/Layout';
import axios from 'axios';

export default function DashboardPage() {
  const navigate = useNavigate();
  // const [correctAnswers, setCorrectAnswers] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [hasNavigated, setHasNavigated] = useState(false);
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

  // 更新週次選擇
  // const handleChange = (event) => {
  //   const weekNumber = event.target.value;
  //   setSelectedWeek(weekNumber);
  //   selectWeek(weekNumber);
  // };
  function selectWeek(weekNumber) {
    console.log("Current URL weekId:", weekNumber); // 檢查 URL 中的 weekId
    navigate(`/dashboard/week/${weekNumber}`);
    if (weekNumber === 15) {
      navigate(`/dashboard/all`);
    }
  }


  // Calculate current week based on today's date
  useEffect(() => {
    if (!hasNavigated) {  // 確保只進行一次自動導航
      const currentDate = new Date();
      
      // 計算當前周次
      const findCurrentWeek = () => {
        let currentWeekValue = 1; // 默認為第一周
        for (let i = 0; i < weeks.length - 1; i++) {
          const [month, day] = weeks[i].name.split('月').map((s) => parseInt(s));
          const weekDate = new Date(currentDate.getFullYear(), month - 1, day);
          if (currentDate >= weekDate) {
            currentWeekValue = weeks[i].value; // 更新為最新匹配到的周次
          }
        }
        return currentWeekValue;
      };
  
      const currentWeekValue = findCurrentWeek(); // 計算當前周次
      setSelectedWeek(currentWeekValue);  // 設定當前周次
  
      // 自動導航至當前周次的頁面
      if (currentWeekValue === 15) {
        navigate(`/dashboard/all`);
      } else {
        navigate(`/dashboard/week/${currentWeekValue}`);
      }
  
      // 在導航完成後再設置為已導航，避免重複
      setHasNavigated(true);
    }
  }, [navigate, hasNavigated, weeks]);  // 使用 hasNavigated 避免重複導航
  

  
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
              onChange={(event) => {
                selectWeek(event.target.value)}}
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
    </Layout>
  );
}
