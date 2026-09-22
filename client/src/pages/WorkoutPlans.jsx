import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AddRounded, DeleteOutlineRounded, EditRounded, RemoveRounded } from "@mui/icons-material";
import {
  createWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
} from "../api";

const emptyExercise = () => ({
  name: "",
  sets: 3,
  reps: "8-12",
  weight: "Bodyweight",
  rest: "60 sec",
  duration: "",
  comments: "",
});

const newPlan = () => ({
  title: "",
  goal: "General fitness",
  days: [{ day: 1, name: "Day 1", focus: "Full body", exercises: [emptyExercise()] }],
});

const Container = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 28px 18px 80px;
`;
const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;
const Header = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  @media (max-width: 700px) { align-items: start; flex-direction: column; }
`;
const Heading = styled.div`
  color: ${({ theme }) => theme.text_primary};
  h1 { margin: 0 0 6px; font-size: 30px; }
  p { margin: 0; color: ${({ theme }) => theme.text_secondary}; font-size: 14px; }
`;
const Panel = styled.section`
  padding: 22px;
  margin-bottom: 26px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  background: ${({ theme }) => theme.card};
  box-shadow: 1px 6px 20px 0 ${({ theme }) => theme.primary + 15};
`;
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 650px) { grid-template-columns: 1fr; }
`;
const Field = styled.label`
  display: grid;
  gap: 6px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 12px;
  ${({ full }) => full && "grid-column: 1 / -1;"}
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 60};
  border-radius: 7px;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  font: inherit;
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.primary}; }
`;
const DayEditor = styled.div`
  margin-top: 18px;
  padding: 16px;
  border-left: 4px solid ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + "08"};
`;
const DayHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 10px;
  align-items: end;
  @media (max-width: 800px) { grid-template-columns: 1fr 1fr; } 
`;
const ExerciseEditor = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 70px 100px 1fr 100px 100px auto;
  gap: 8px;
  align-items: end;
  margin-top: 10px;
  @media (max-width: 1000px) { grid-template-columns: 1.5fr 70px 100px; }
`;
const Action = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid ${({ theme, danger }) => danger ? theme.red : theme.primary};
  border-radius: 7px;
  background: ${({ theme, filled }) => filled ? theme.primary : "transparent"};
  color: ${({ theme, filled, danger }) => filled ? theme.white : danger ? theme.red : theme.primary};
  cursor: pointer;
  font: inherit;
  font-size: 12px;
`;
const Actions = styled.div` display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px; `;
const SectionTitle = styled.h2` font-size: 18px; color: ${({ theme }) => theme.text_primary}; margin: 0; `;
const PlanTitle = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-bottom: 12px;
  h3 { margin: 0; color: ${({ theme }) => theme.text_primary}; font-size: 20px; }
  p { margin: 4px 0 0; color: ${({ theme }) => theme.text_secondary}; font-size: 13px; }
  @media (max-width: 600px) { align-items: start; flex-direction: column; }
`;
const PlanActions = styled.div` display: flex; gap: 7px; `;
const PlanTable = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 70px 90px 1.15fr 1.15fr 100px;
  min-width: 760px;
  background: ${({ theme, header }) => header ? theme.primary : theme.card};
  color: ${({ theme, header }) => header ? theme.white : theme.text_primary};
  font-size: 12px;
  > div { padding: 10px; border-right: 1px solid ${({ theme }) => theme.text_primary + 18}; border-bottom: 1px solid ${({ theme }) => theme.text_primary + 18}; }
`;
const DayBand = styled.div`
  padding: 10px 12px;
  margin-top: 18px;
  background: ${({ theme }) => theme.secondary + 25};
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
`;
const Notice = styled.div`
  position: fixed; top: 96px; right: 24px; z-index: 50;
  padding: 12px 18px; border-radius: 8px; background: ${({ theme }) => theme.card};
  color: ${({ theme, error }) => error ? theme.red : theme.green};
  border: 1px solid ${({ theme, error }) => (error ? theme.red : theme.green) + "70"};
`;

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(newPlan);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(false);
  const token = localStorage.getItem("fittrack-app-token");

  const showNotice = (message, isError = false) => {
    setError(isError);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const loadPlans = async () => {
    try { setPlans((await getWorkoutPlans(token)).data.plans || []); }
    catch (requestError) { showNotice(requestError.response?.data?.message || "Unable to load plans.", true); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPlans(); }, []);

  const updatePlanField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateDay = (dayIndex, field, value) => setForm((current) => ({
    ...current,
    days: current.days.map((day, index) => index === dayIndex ? { ...day, [field]: value } : day),
  }));
  const updateExercise = (dayIndex, exerciseIndex, field, value) => setForm((current) => ({
    ...current,
    days: current.days.map((day, index) => index !== dayIndex ? day : {
      ...day,
      exercises: day.exercises.map((exercise, itemIndex) => itemIndex === exerciseIndex ? { ...exercise, [field]: value } : exercise),
    }),
  }));
  const addDay = () => setForm((current) => ({ ...current, days: [...current.days, { day: current.days.length + 1, name: `Day ${current.days.length + 1}`, focus: "", exercises: [emptyExercise()] }] }));
  const removeDay = (dayIndex) => setForm((current) => ({ ...current, days: current.days.filter((_, index) => index !== dayIndex).map((day, index) => ({ ...day, day: index + 1 })) }));
  const addExercise = (dayIndex) => updateDay(dayIndex, "exercises", [...form.days[dayIndex].exercises, emptyExercise()]);
  const removeExercise = (dayIndex, exerciseIndex) => updateDay(dayIndex, "exercises", form.days[dayIndex].exercises.filter((_, index) => index !== exerciseIndex));

  const savePlan = async () => {
    setSaving(true);
    try {
      const response = editingId ? await updateWorkoutPlan(token, editingId, form) : await createWorkoutPlan(token, form);
      setPlans((current) => editingId ? current.map((plan) => plan._id === editingId ? response.data.plan : plan) : [response.data.plan, ...current]);
      setForm(newPlan()); setEditingId(null); showNotice(response.data.message);
    } catch (requestError) { showNotice(requestError.response?.data?.message || "Unable to save plan.", true); }
    finally { setSaving(false); }
  };

  const editPlan = (plan) => { setForm({ title: plan.title, goal: plan.goal, days: plan.days }); setEditingId(plan._id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const removePlan = async (id) => {
    if (!window.confirm("Delete this workout plan?")) return;
    try { await deleteWorkoutPlan(token, id); setPlans((current) => current.filter((plan) => plan._id !== id)); showNotice("Workout plan deleted successfully."); }
    catch (requestError) { showNotice(requestError.response?.data?.message || "Unable to delete plan.", true); }
  };

  return (
    <Container><Wrapper>
      <Header><Heading><h1>Workout Plan</h1><p>Build a clear week of training, one exercise row at a time.</p></Heading></Header>
      <Panel>
        <SectionTitle>{editingId ? "Edit workout plan" : "Create a workout plan"}</SectionTitle>
        <FormGrid>
          <Field>Plan title<Input value={form.title} placeholder="7-Day Home Dumbbell Workout" onChange={(event) => updatePlanField("title", event.target.value)} /></Field>
          <Field>Goal<Input value={form.goal} placeholder="Strength, mobility, general fitness" onChange={(event) => updatePlanField("goal", event.target.value)} /></Field>
        </FormGrid>
        {form.days.map((day, dayIndex) => <DayEditor key={`${day.day}-${dayIndex}`}>
          <DayHeader>
            <Field>Day<Input type="number" min="1" max="7" value={day.day} onChange={(event) => updateDay(dayIndex, "day", event.target.value)} /></Field>
            <Field>Focus<Input value={day.focus} placeholder="Chest + shoulders" onChange={(event) => updateDay(dayIndex, "focus", event.target.value)} /></Field>
            <Action type="button" danger onClick={() => removeDay(dayIndex)} disabled={form.days.length === 1}><RemoveRounded fontSize="small" /> Day</Action>
          </DayHeader>
          {day.exercises.map((exercise, exerciseIndex) => <ExerciseEditor key={exerciseIndex}>
            {["name", "sets", "reps", "weight", "rest", "duration"].map((field) => <Field key={field}>{field === "name" ? "Exercise" : field[0].toUpperCase() + field.slice(1)}<Input type={field === "sets" ? "number" : "text"} value={exercise[field]} onChange={(event) => updateExercise(dayIndex, exerciseIndex, field, event.target.value)} /></Field>)}
            <Action type="button" danger onClick={() => removeExercise(dayIndex, exerciseIndex)} disabled={day.exercises.length === 1}><RemoveRounded fontSize="small" /></Action>
          </ExerciseEditor>)}
          <Actions><Action type="button" onClick={() => addExercise(dayIndex)}><AddRounded fontSize="small" /> Exercise</Action></Actions>
        </DayEditor>)}
        <Actions><Action type="button" onClick={addDay}><AddRounded fontSize="small" /> Day</Action><Action type="button" filled onClick={savePlan} disabled={saving}>{saving ? "Saving..." : editingId ? "Update plan" : "Save plan"}</Action>{editingId && <Action type="button" onClick={() => { setForm(newPlan()); setEditingId(null); }}>Cancel</Action>}</Actions>
      </Panel>
      <SectionTitle>Saved plans</SectionTitle>
      {loading ? <p>Loading workout plans...</p> : plans.length === 0 ? <Panel><p>No workout plans yet. Create your first plan above.</p></Panel> : plans.map((plan) => <Panel key={plan._id}>
        <PlanTitle><div><h3>{plan.title}</h3><p>{plan.goal}</p></div><PlanActions><Action type="button" onClick={() => editPlan(plan)}><EditRounded fontSize="small" /> Edit</Action><Action type="button" danger onClick={() => removePlan(plan._id)}><DeleteOutlineRounded fontSize="small" /> Delete</Action></PlanActions></PlanTitle>
        {plan.days.map((day) => <React.Fragment key={day._id || day.day}>
          <DayBand>DAY {day.day} - {day.focus || "Rest / Recovery"}</DayBand>
          <PlanTable>
            <Row header><div>Exercise & details</div><div>Sets</div><div>Reps</div><div>Weight</div><div>Duration</div><div>Rest</div></Row>
            {day.exercises.map((exercise) => <Row key={exercise._id || exercise.name}><div>{exercise.name}</div><div>{exercise.sets}</div><div>{exercise.reps}</div><div>{exercise.weight || "-"}</div><div>{exercise.duration || exercise.comments || "-"}</div><div>{exercise.rest || "-"}</div></Row>)}
          </PlanTable>
        </React.Fragment>)}
      </Panel>)}
      {notice && <Notice error={error}>{notice}</Notice>}
    </Wrapper></Container>
  );
};

export default WorkoutPlans;