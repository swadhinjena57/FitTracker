import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import {
  DarkModeRounded,
  EmojiEventsRounded,
  FitnessCenterRounded,
  LockRounded,
  LogoutRounded,
  LocalFireDepartmentRounded,
  VisibilityRounded,
  VisibilityOffRounded,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { changePassword, getDashboardDetails, updateProfile } from "../api";
import { logout, updateUser } from "../redux/reducers/userSlice";

const Container = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 30px 16px 80px;
`;
const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;
const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const ProfileAvatar = styled(Avatar)`
  width: 104px !important;
  height: 104px !important;
  margin: 16px 0;
  border: 4px solid ${({ theme }) => theme.primary + 28};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  font-size: 38px !important;
`;
const Eyebrow = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.8px;
`;
const Name = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 28px;
  font-weight: 600;
`;
const Tagline = styled.p`
  margin: 6px 0 16px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;
const EditButton = styled.button`
  padding: 10px 22px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  &:hover {
    background: ${({ theme }) => theme.primary + 10};
  }
`;
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => theme.black + 70};
`;
const Modal = styled.div`
  width: min(100%, 520px);
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  border-radius: 14px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 18px 50px ${({ theme }) => theme.black + 45};
`;
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;
const ModalTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 20px;
`;
const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  font-size: 22px;
`;
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;
const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 11px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 70};
  border-radius: 7px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font: inherit;
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.primary}; }
`;
const FileInput = styled(Input)`
  padding: 8px;
  font-size: 12px;
`;
const PasswordInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + 70};
  border-radius: 7px;
  background: ${({ theme }) => theme.bg};
  &:focus-within { border-color: ${({ theme }) => theme.primary}; }
`;
const PasswordInput = styled(Input)`
  border: 0;
  background: transparent;
`;
const VisibilityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.primary}; }
`;
const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;
const ActionButton = styled(EditButton)`
  background: ${({ primary, theme }) => (primary ? theme.primary : "transparent")};
  color: ${({ primary, theme }) => (primary ? theme.white : theme.primary)};
`;
const Message = styled.div`
  margin-top: 12px;
  color: ${({ error, theme }) => (error ? theme.red : theme.green)};
  font-size: 13px;
`;
const ProfileToast = styled.div`
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
  font-size: 13px;
  @media (max-width: 600px) {
    right: 16px;
    left: 16px;
    text-align: center;
  }
`;
const Footer = styled.footer`
  margin-top: 42px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
  line-height: 1.8;
  text-align: center;
`;
const Panel = styled.section`
  margin-top: 30px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  background: ${({ theme }) => theme.card};
  box-shadow: 1px 6px 20px ${({ theme }) => theme.primary + 10};
`;
const PanelTitle = styled.h2`
  margin: 0 0 20px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-align: center;
`;
const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  @media (max-width: 650px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const Detail = styled.div`
  text-align: center;
`;
const DetailLabel = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;
const DetailValue = styled.div`
  margin-top: 5px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 17px;
  font-weight: 600;
`;
const SectionTitle = styled.h2`
  margin: 34px 0 16px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
`;
const Stat = styled.div`
  padding: 18px 10px;
  border: 1px solid ${({ theme }) => theme.primary + 18};
  border-radius: 12px;
  text-align: center;
`;
const StatValue = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 26px;
  font-weight: 700;
`;
const StatLabel = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;
const AchievementGrid = styled(StatsGrid)``;
const Achievement = styled(Stat)`
  padding: 14px 8px;
  opacity: ${({ earned }) => (earned ? 1 : 0.45)};
`;
const AchievementIcon = styled.div`
  color: ${({ earned, theme }) => (earned ? theme.orange : theme.text_secondary)};
  font-size: 28px;
`;
const Settings = styled.div`
  display: flex;
  flex-direction: column;
`;
const SettingButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.text_primary + 12};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  text-align: left;
  &:last-child {
    border-bottom: 0;
  }
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Profile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [stats, setStats] = useState({ totalWorkouts: 0, workoutsThisWeek: 0, streak: 0 });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (currentUser) setEditForm({ ...currentUser });
  }, [currentUser]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const token = localStorage.getItem("fittrack-app-token");
    getDashboardDetails(token)
      .then((response) => setStats(response.data))
      .catch(() => setStats({ totalWorkouts: 0, workoutsThisWeek: 0, streak: 0 }));
  }, []);

  const token = localStorage.getItem("fittrack-app-token");
  const updateField = (event) => setEditForm({ ...editForm, [event.target.name]: event.target.value });
  const selectProfileImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setEditForm((current) => ({ ...current, img: reader.result }));
    reader.readAsDataURL(file);
  };
  const saveProfile = async (event) => {
    event.preventDefault();
    if (!token) {
      setMessageIsError(true);
      setMessage("Your session has expired. Please sign in again.");
      return;
    }

    setMessage("");
    setMessageIsError(false);
    setIsSavingProfile(true);
    try {
      const response = await updateProfile(token, {
        ...editForm,
        age: editForm.age ? Number(editForm.age) : undefined,
        height: editForm.height ? Number(editForm.height) : undefined,
        weight: editForm.weight ? Number(editForm.weight) : undefined,
        targetWeight: editForm.targetWeight ? Number(editForm.targetWeight) : undefined,
        weeklyWorkoutGoal: editForm.weeklyWorkoutGoal ? Number(editForm.weeklyWorkoutGoal) : undefined,
        dailyCalories: editForm.dailyCalories ? Number(editForm.dailyCalories) : undefined,
      });
      dispatch(updateUser(response.data.user));
      setIsEditOpen(false);
      setMessage("Profile updated successfully.");
      setMessageIsError(false);
    } catch (error) {
      setMessageIsError(true);
      setMessage(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };
  const savePassword = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      await changePassword(token, passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsPasswordOpen(false);
      setMessage("Password changed successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to change password.");
    }
  };
  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };
  const toggleTheme = async () => {
    const nextTheme = currentUser?.theme === "dark" ? "light" : "dark";
    localStorage.setItem("fittrack-theme", nextTheme);
    dispatch(updateUser({ ...currentUser, theme: nextTheme }));
    window.dispatchEvent(new CustomEvent("fittrack-theme-change", { detail: nextTheme }));
    try {
      const response = await updateProfile(token, { theme: nextTheme });
      dispatch(updateUser(response.data.user));
    } catch {
      setMessage("Theme changed locally, but could not be saved.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Hero>
          <Eyebrow>PROFILE</Eyebrow>
          <ProfileAvatar src={currentUser?.img}>
            {currentUser?.name?.[0] ?? "U"}
          </ProfileAvatar>
          <Name>{currentUser?.name ?? "FitTrack Member"}</Name>
          <Tagline>Stay consistent. Get stronger.</Tagline>
          <EditButton type="button" onClick={() => setIsEditOpen(true)}>Edit Profile</EditButton>
        </Hero>

        <Panel>
          <PanelTitle>PERSONAL DETAILS</PanelTitle>
          <DetailsGrid>
            <Detail><DetailLabel>Age</DetailLabel><DetailValue>{currentUser?.age ?? "Not set"}</DetailValue></Detail>
            <Detail><DetailLabel>Height</DetailLabel><DetailValue>{currentUser?.height ? `${currentUser.height} cm` : "Not set"}</DetailValue></Detail>
            <Detail><DetailLabel>Weight</DetailLabel><DetailValue>{currentUser?.weight ? `${currentUser.weight} kg` : "Not set"}</DetailValue></Detail>
            <Detail><DetailLabel>Goal</DetailLabel><DetailValue>{currentUser?.goal || "Not set"}</DetailValue></Detail>
          </DetailsGrid>
        </Panel>

        <SectionTitle>🎯 MY GOALS</SectionTitle>
        <StatsGrid>
          <Stat><StatValue>{currentUser?.targetWeight ? `${currentUser.targetWeight} kg` : "Not set"}</StatValue><StatLabel>Target Weight</StatLabel></Stat>
          <Stat><StatValue>{currentUser?.weeklyWorkoutGoal ?? 5}</StatValue><StatLabel>Weekly Workouts</StatLabel></Stat>
          <Stat><StatValue>{currentUser?.dailyCalories ?? 2500}</StatValue><StatLabel>Daily Calories</StatLabel></Stat>
        </StatsGrid>

        <SectionTitle>📊 MY STATS</SectionTitle>
        <StatsGrid>
          <Stat><StatValue>{stats.totalWorkouts ?? 0}</StatValue><StatLabel>Workouts</StatLabel></Stat>
          <Stat><StatValue>{stats.workoutsThisWeek ?? 0}</StatValue><StatLabel>This Week</StatLabel></Stat>
          <Stat><StatValue>{stats.streak ?? 0} 🔥</StatValue><StatLabel>Streak</StatLabel></Stat>
        </StatsGrid>

        <SectionTitle>🏆 ACHIEVEMENTS</SectionTitle>
        <AchievementGrid>
          <Achievement earned={stats.totalWorkouts >= 1}><AchievementIcon earned={stats.totalWorkouts >= 1}><EmojiEventsRounded /></AchievementIcon><StatLabel>First Workout</StatLabel></Achievement>
          <Achievement earned={stats.streak >= 7}><AchievementIcon earned={stats.streak >= 7}><LocalFireDepartmentRounded /></AchievementIcon><StatLabel>7-Day Streak</StatLabel></Achievement>
          <Achievement earned={stats.totalWorkouts >= 10}><AchievementIcon earned={stats.totalWorkouts >= 10}><FitnessCenterRounded /></AchievementIcon><StatLabel>10 Workouts</StatLabel></Achievement>
        </AchievementGrid>

        <SectionTitle>⚙️ SETTINGS</SectionTitle>
        <Panel>
          <Settings>
            <SettingButton type="button" onClick={toggleTheme}><DarkModeRounded />Appearance ({currentUser?.theme === "dark" ? "Dark" : "Light"})</SettingButton>
            <SettingButton type="button" onClick={() => setIsPasswordOpen(true)}><LockRounded />Change Password</SettingButton>
            <SettingButton type="button" onClick={() => dispatch(logout())}><LogoutRounded />Logout</SettingButton>
          </Settings>
        </Panel>
        {message && <ProfileToast error={messageIsError}>{message}</ProfileToast>}
        <Footer>
          <div>Track. Train. Transform. 💪</div>
          <div>© 2026 FitTrack. All rights reserved.</div>
        </Footer>
      </Wrapper>
      {isEditOpen && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader><ModalTitle>Edit Profile</ModalTitle><CloseButton type="button" onClick={() => setIsEditOpen(false)}>×</CloseButton></ModalHeader>
            <form onSubmit={saveProfile}>
              <FormGrid>
                <Field>Name<Input name="name" value={editForm.name ?? ""} onChange={updateField} /></Field>
                <Field>Profile image<FileInput name="image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={selectProfileImage} /></Field>
                {[['age', 'Age'], ['height', 'Height (cm)'], ['weight', 'Weight (kg)'], ['goal', 'Goal'], ['targetWeight', 'Target weight (kg)'], ['weeklyWorkoutGoal', 'Weekly workouts'], ['dailyCalories', 'Daily calories']].map(([name, label]) => (
                  <Field key={name}>{label}<Input name={name} type={['age', 'height', 'weight', 'targetWeight', 'weeklyWorkoutGoal', 'dailyCalories'].includes(name) ? 'number' : 'text'} value={editForm[name] ?? ''} onChange={updateField} /></Field>
                ))}
              </FormGrid>
              <ModalActions><ActionButton type="button" onClick={() => setIsEditOpen(false)}>Cancel</ActionButton><ActionButton primary type="submit" disabled={isSavingProfile}>{isSavingProfile ? "Saving..." : "Save Profile"}</ActionButton></ModalActions>
            </form>
          </Modal>
        </ModalBackdrop>
      )}
      {isPasswordOpen && (
        <ModalBackdrop>
          <Modal>
            <ModalHeader><ModalTitle>Change Password</ModalTitle><CloseButton type="button" onClick={() => setIsPasswordOpen(false)}>×</CloseButton></ModalHeader>
            <form onSubmit={savePassword}>
              <FormGrid>
                {[['currentPassword', 'Current password'], ['newPassword', 'New password'], ['confirmPassword', 'Confirm new password']].map(([name, label]) => (
                  <Field key={name}>
                    {label}
                    <PasswordInputWrapper>
                      <PasswordInput required name={name} type={visiblePasswords[name] ? "text" : "password"} value={passwordForm[name]} onChange={(event) => setPasswordForm({ ...passwordForm, [name]: event.target.value })} />
                      <VisibilityButton type="button" aria-label={`${visiblePasswords[name] ? "Hide" : "Show"} ${label}`} onClick={() => togglePasswordVisibility(name)}>
                        {visiblePasswords[name] ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                      </VisibilityButton>
                    </PasswordInputWrapper>
                  </Field>
                ))}
              </FormGrid>
              <ModalActions><ActionButton type="button" onClick={() => setIsPasswordOpen(false)}>Cancel</ActionButton><ActionButton primary type="submit">Update Password</ActionButton></ModalActions>
            </form>
          </Modal>
        </ModalBackdrop>
      )}
    </Container>
  );
};

export default Profile;
