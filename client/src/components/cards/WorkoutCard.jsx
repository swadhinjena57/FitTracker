import { DeleteOutlineRounded, EditRounded, FitnessCenterRounded, TimelapseRounded } from "@mui/icons-material";
import React, { useState } from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 16px 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 12px 14px;
  }
`;
const Category = styled.div`
  width: fit-content;
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  background: ${({ theme }) => theme.primary + 20};
  padding: 4px 10px;
  border-radius: 8px;
`;
const Name = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
`;
const Sets = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  display: flex;
  gap: 6px;
`;
const Flex = styled.div`
  display: flex;
  gap: 16px;
`;
const Details = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;
const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 10px;
  border: 1px solid ${({ theme, danger }) => (danger ? theme.red : theme.primary)};
  border-radius: 7px;
  background: transparent;
  color: ${({ theme, danger }) => (danger ? theme.red : theme.primary)};
  cursor: pointer;
  font: inherit;
  font-size: 12px;
`;
const EditForm = styled.div`
  display: grid;
  gap: 8px;
`;
const EditInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 6px;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  font: inherit;
`;

const WorkoutCard = ({ workout, onEdit, onDelete, showActions = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...workout });

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const saveEdit = async () => {
    await onEdit(workout._id, {
      category: form.category,
      workoutName: form.workoutName,
      sets: form.sets,
      reps: form.reps,
      weight: form.weight,
      duration: form.duration,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      {isEditing ? (
        <EditForm>
          {[["category", "Category"], ["workoutName", "Workout name"], ["sets", "Sets"], ["reps", "Reps"], ["weight", "Weight (kg)"], ["duration", "Duration (min)"]].map(([name, label]) => (
            <EditInput key={name} aria-label={label} name={name} type={name === "category" || name === "workoutName" ? "text" : "number"} value={form[name] ?? ""} onChange={updateField} />
          ))}
          <Actions>
            <ActionButton type="button" onClick={saveEdit}>Save</ActionButton>
            <ActionButton type="button" onClick={() => setIsEditing(false)}>Cancel</ActionButton>
          </Actions>
        </EditForm>
      ) : (
        <>
          <Category>#{workout?.category}</Category>
          <Name>{workout?.workoutName}</Name>
          <Sets>Count: {workout?.sets} sets X {workout?.reps} reps</Sets>
          <Flex>
            <Details><FitnessCenterRounded sx={{ fontSize: "20px" }} />{workout?.weight} kg</Details>
            <Details><TimelapseRounded sx={{ fontSize: "20px" }} />{workout?.duration} min</Details>
          </Flex>
          {showActions && (
            <Actions>
              <ActionButton type="button" onClick={() => setIsEditing(true)}><EditRounded fontSize="small" />Edit</ActionButton>
              <ActionButton danger type="button" onClick={() => onDelete(workout._id)}><DeleteOutlineRounded fontSize="small" />Delete</ActionButton>
            </Actions>
          )}
        </>
      )}
    </Card>
  );
};

export default WorkoutCard;
