import React from "react";
import styled from "styled-components";
import { AddRounded, RemoveRounded } from "@mui/icons-material";
import Button from "./Button";

const Card = styled.div`
  flex: 1;
  min-width: 320px;
  height: 570px;
  max-height: 570px;
  box-sizing: border-box;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0 ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  @media (max-width: 600px) {
    height: 540px;
    max-height: 540px;
    padding: 16px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;
const DateLabel = styled.label`
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary};
`;
const DateInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 0.5px solid ${({ theme }) => theme.text_secondary};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  font: inherit;
  outline: none;
  color-scheme: ${({ theme }) => theme.isDark ? "dark" : "light"};
`;
const ExerciseBlock = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 10px;
  background: ${({ theme }) => theme.bgLight};
`;
const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
const Field = styled.label`
  display: grid;
  gap: 5px;
  min-width: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 11px;
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 70};
  border-radius: 7px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  font: inherit;
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.primary}; }
`;
const ExerciseName = styled(Input)`
  font-size: 14px;
`;
const Details = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1fr;
  gap: 8px;
  @media (max-width: 520px) { grid-template-columns: 1fr 1fr; }
`;
const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid ${({ theme, danger }) => danger ? theme.red : theme.primary};
  border-radius: 7px;
  background: transparent;
  color: ${({ theme, danger }) => danger ? theme.red : theme.primary};
  cursor: pointer;
`;
const AddAnother = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  position: sticky;
  bottom: 0;
  z-index: 2;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 7px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  box-shadow: 0 -8px 12px ${({ theme }) => theme.bgLight + 90};
`;
const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
`;

const AddWorkout = ({
  exercises,
  setExercises,
  workoutDate,
  setWorkoutDate,
  addNewWorkout,
  buttonLoading,
}) => {
  const updateExercise = (index, field, value) => {
    setExercises((current) => current.map((exercise, exerciseIndex) =>
      exerciseIndex === index ? { ...exercise, [field]: value } : exercise
    ));
  };

  const addExercise = () => setExercises((current) => [
    ...current,
    { category: "Legs", workoutName: "", sets: 3, reps: 10, weight: "", duration: 10 },
  ]);

  const removeExercise = (index) => {
    if (exercises.length === 1) return;
    setExercises((current) => current.filter((_, exerciseIndex) => exerciseIndex !== index));
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      <DateLabel htmlFor="workout-date">
        Workout Date
        <DateInput
          id="workout-date"
          type="date"
          value={workoutDate}
          onChange={(event) => setWorkoutDate(event.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </DateLabel>
      <ExerciseList>
        {exercises.map((exercise, index) => (
          <ExerciseBlock key={index}>
            <ExerciseHeader>
              <Field>
                Category
                <ExerciseName
                  value={exercise.category}
                  placeholder="Legs"
                  onChange={(event) => updateExercise(index, "category", event.target.value)}
                />
              </Field>
              <IconButton type="button" danger onClick={() => removeExercise(index)} aria-label="Remove workout">
                <RemoveRounded fontSize="small" />
              </IconButton>
            </ExerciseHeader>
            <Field>
              Exercise
              <ExerciseName
                value={exercise.workoutName}
                placeholder="Back Squat"
                onChange={(event) => updateExercise(index, "workoutName", event.target.value)}
              />
            </Field>
            <Details>
              {[['sets', 'Sets'], ['reps', 'Reps'], ['weight', 'Weight'], ['duration', 'Time (min)']].map(([field, label]) => (
                <Field key={field}>
                  {label}
                  <Input
                    type={field === "weight" ? "text" : "number"}
                    min={field === "sets" || field === "reps" || field === "duration" ? 0 : undefined}
                    value={exercise[field]}
                    placeholder={field === "weight" ? "30 kg" : "0"}
                    onChange={(event) => updateExercise(index, field, event.target.value)}
                  />
                </Field>
              ))}
            </Details>
          </ExerciseBlock>
        ))}
        <AddAnother type="button" onClick={addExercise}><AddRounded fontSize="small" /> Add Another</AddAnother>
      </ExerciseList>
      <Button text="Add Workout" small onClick={addNewWorkout} isLoading={buttonLoading} isDisabled={buttonLoading} />
    </Card>
  );
};

export default AddWorkout;
