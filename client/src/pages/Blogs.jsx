import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { blogs } from "../utils/blogs";

const Container = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 28px 16px 80px;
`;
const Wrapper = styled.div`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
`;
const Header = styled.div`
  margin-bottom: 26px;
`;
const Eyebrow = styled.div`
  margin-bottom: 6px;
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;
const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 30px;
  font-weight: 600;
`;
const Description = styled.p`
  max-width: 620px;
  margin: 8px 0 0;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  line-height: 1.6;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  @media (max-width: 950px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.article`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 12px;
  background: ${({ theme }) => theme.card};
  box-shadow: 1px 6px 20px ${({ theme }) => theme.primary + 12};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 1px 12px 26px ${({ theme }) => theme.primary + 22};
  }
`;
const Cover = styled.img`
  display: block;
  width: 100%;
  height: 190px;
  object-fit: cover;
`;
const CardBody = styled.div`
  display: flex;
  min-height: 230px;
  flex-direction: column;
  padding: 18px;
`;
const Category = styled.div`
  margin-bottom: 9px;
  color: ${({ theme }) => theme.primary};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;
const CardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 19px;
  line-height: 1.3;
`;
const Excerpt = styled.p`
  margin: 12px 0 18px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
  line-height: 1.6;
`;
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
`;
const Meta = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;
const ReadMore = styled(Link)`
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
`;

const Blogs = () => {
  return (
    <Container>
      <Wrapper>
        <Header>
          <Eyebrow>FitTrack Journal</Eyebrow>
          <Title>Fitness, nutrition, and better recovery</Title>
          <Description>
            Practical education and workout advice to help you train with more
            confidence and make progress that lasts.
          </Description>
        </Header>
        <Grid>
          {blogs.map((blog) => (
            <Card key={blog.slug}>
              <Cover src={blog.image} alt={blog.title} />
              <CardBody>
                <Category>{blog.category}</Category>
                <CardTitle>{blog.title}</CardTitle>
                <Excerpt>{blog.excerpt}</Excerpt>
                <CardFooter>
                  <Meta>{blog.category} &bull; {blog.readingTime}</Meta>
                  <ReadMore to={`/blogs/${blog.slug}`}>Read More &rarr;</ReadMore>
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Wrapper>
    </Container>
  );
};

export default Blogs;
