import React from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 28px 16px 80px;
`;
const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
`;
const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 28px;
  font-weight: 600;
`;
const Description = styled.p`
  margin: 8px 0 24px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;
const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;
const VideoCard = styled.article`
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  background: ${({ theme }) => theme.card};
  box-shadow: 1px 8px 24px ${({ theme }) => theme.primary + 14};
`;
const VideoFrame = styled.iframe`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  background: ${({ theme }) => theme.black};
`;
const VideoInfo = styled.div`
  padding: 14px 16px 16px;
`;
const VideoCategory = styled.div`
  margin-bottom: 4px;
  color: ${({ theme }) => theme.primary};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;
const VideoTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  font-weight: 600;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const videos = [
  {
    id: "UBMk30rjy0o",
    category: "Full Body",
    title: "Beginner Full-Body Workout",
  },
  {
    id: "IODxDxX7oi4",
    category: "Dumbbell Training",
    title: "Full-Body Dumbbell Workout",
  },
  {
    id: "U0bhE67HuDY",
    category: "Muscle Training",
    title: "Upper-Body Muscle Workout",
  },
  {
    id: "gC_L9qAHVJ8",
    category: "Weight Lifting",
    title: "Weight-Lifting Fundamentals",
  },
];

const Tutorials = () => {
  return (
    <Container>
      <Wrapper>
        <Title>Fitness Tutorials</Title>
        <Description>Build strength, improve technique, and train with guided videos.</Description>
        <VideoGrid>
          {videos.map((video) => (
            <VideoCard key={video.id}>
              <VideoFrame
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <VideoInfo>
                <VideoCategory>{video.category}</VideoCategory>
                <VideoTitle>{video.title}</VideoTitle>
              </VideoInfo>
            </VideoCard>
          ))}
        </VideoGrid>
      </Wrapper>
    </Container>
  );
};

export default Tutorials;
