import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { deleteWorkout, getWorkouts, updateWorkout } from "../api";
import { CircularProgress } from "@mui/material";
import { useTheme } from "styled-components";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const Right = styled.div`
  flex: 1;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const Toast = styled.div`
  position: fixed;
  top: 96px;
  right: 24px;
  z-index: 50;
  padding: 12px 18px;
  border: 1px solid ${({ error, theme }) => (error ? theme.red : theme.green) + "70"};
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  color: ${({ error, theme }) => (error ? theme.red : theme.green)};
  box-shadow: 0 8px 22px ${({ theme }) => theme.black + 20};
`;
const CalendarFrame = styled.div`
  .MuiPickersCalendarHeader-label,
  .MuiDayCalendar-weekDayLabel,
  .MuiPickersDay-root,
  .MuiPickersDay-root *,
  .MuiPickersArrowSwitcher-button,
  .MuiPickersCalendarHeader-switchViewButton,
  .MuiPickersCalendarHeader-switchViewButton * {
    color: ${({ isDark, theme }) => (isDark ? `${theme.white} !important` : `${theme.text_primary} !important`)};
  }
`;

const Workouts = () => {
  const theme = useTheme();
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const getTodaysWorkout = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const response = await getWorkouts(token, date);
      setTodaysWorkouts(response?.data?.todaysWorkouts ?? []);
    } catch (error) {
      setMessageIsError(true);
      setMessage(error.response?.data?.message || "Unable to load workouts.");
    } finally {
      setLoading(false);
    }
  };

  const editWorkout = async (id, updates) => {
    try {
      const token = localStorage.getItem("fittrack-app-token");
      const response = await updateWorkout(token, id, updates);
      setTodaysWorkouts((current) => current.map((workout) => workout._id === id ? response.data.workout : workout));
      setMessageIsError(false);
      setMessage("Workout edited successfully.");
    } catch (error) {
      setMessageIsError(true);
      setMessage(error.response?.data?.message || "Unable to edit workout.");
      throw error;
    }
  };

  const removeWorkout = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    try {
      const token = localStorage.getItem("fittrack-app-token");
      await deleteWorkout(token, id);
      setTodaysWorkouts((current) => current.filter((workout) => workout._id !== id));
      setMessageIsError(false);
      setMessage("Workout deleted successfully.");
    } catch (error) {
      setMessageIsError(true);
      setMessage(error.response?.data?.message || "Unable to delete workout.");
    }
  };

  useEffect(() => {
    getTodaysWorkout();
  }, [date]);
  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CalendarFrame isDark={theme.isDark}>
              <DateCalendar
                sx={{
                  color: theme.isDark ? theme.white : theme.text_primary,
                  "& .MuiPickersDay-root.Mui-selected": { backgroundColor: `${theme.primary} !important`, color: `${theme.white} !important` },
                  "& .MuiPickersDay-root.MuiPickersDay-today": { borderColor: `${theme.primary} !important` },
                  "& .MuiSvgIcon-root": { color: `${theme.isDark ? theme.white : theme.text_primary} !important` },
                }}
                onChange={(value) => setDate(value ? value.format("YYYY-MM-DD") : "")}
              />
            </CalendarFrame>
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>
              {date ? `Workouts for ${dayjs(date).format("MMMM D, YYYY")}` : "Today's Workout"}
            </SecTitle>
            {loading ? (
              <CircularProgress />
            ) : (
              <CardWrapper>
                {todaysWorkouts.map((workout) => (
                  <WorkoutCard key={workout._id} workout={workout} onEdit={editWorkout} onDelete={removeWorkout} showActions />
                ))}
              </CardWrapper>
            )}
          </Section>
        </Right>
      </Wrapper>
      {message && <Toast error={messageIsError}>{message}</Toast>}
    </Container>
  );
};

export default Workouts;
