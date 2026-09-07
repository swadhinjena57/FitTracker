import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const DateLabel = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary};
  padding: 0 4px;
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
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.secondary};
  }
`;

const AddWorkout = ({
  workout,
  setWorkout,
  workoutDate,
  setWorkoutDate,
  addNewWorkout,
  buttonLoading,
}) => {
  return (
    <Card>
      <Title>Add New Workout</Title>
      <div>
        <DateLabel htmlFor="workout-date">Workout Date</DateLabel>
        <DateInput
          id="workout-date"
          type="date"
          value={workoutDate}
          onChange={(e) => setWorkoutDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <TextInput
        label="Workout"
        textArea
        rows={10}
        placeholder={`Enter in this format:

#Category
-Workout Name
-Sets
-Reps
-Weight
-Duration`}
        value={workout}
        handelChange={(e) => setWorkout(e.target.value)}
      />
      <Button
        text="Add Workout"
        small
        onClick={() => addNewWorkout()}
        isLoading={buttonLoading}
        isDisabled={buttonLoading}
      />
    </Card>
  );
};

export default AddWorkout;
