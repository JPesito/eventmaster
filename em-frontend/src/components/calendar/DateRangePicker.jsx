import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const DateRangePicker = ({ onChange, value }) => {
  const [startDate, setStartDate] = useState(value[0] || null);
  const [endDate, setEndDate] = useState(value[1] || null);
  const [selectedOption, setSelectedOption] = useState('custom');

  useEffect(() => {
    onChange([startDate, endDate]);
  }, [startDate, endDate, onChange]);

  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);

    if (option === 'semester') {
      const currentYear = moment().year();
      const currentMonth = moment().month();
      let semesterStart, semesterEnd;

      if (currentMonth < 6) {
        // Primer semestre (enero - junio)
        semesterStart = moment([currentYear, 0, 1]);
        semesterEnd = moment([currentYear, 5, 30]);
      } else {
        // Segundo semestre (julio - diciembre)
        semesterStart = moment([currentYear, 6, 1]);
        semesterEnd = moment([currentYear, 11, 31]);
      }

      setStartDate(semesterStart);
      setEndDate(semesterEnd);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="date-range-select-label">Selección de rango</InputLabel>
          <Select
            labelId="date-range-select-label"
            value={selectedOption}
            onChange={handleOptionChange}
            fullWidth
          >
            <MenuItem value="custom">Personalizado</MenuItem>
            <MenuItem value="semester">Semestre</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <DatePicker
          label="Fecha inicial"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            setSelectedOption('custom');
          }}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <DatePicker
          label="Fecha final"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            setSelectedOption('custom');
          }}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Grid>
    </Grid>
  );
};

export default DateRangePicker;