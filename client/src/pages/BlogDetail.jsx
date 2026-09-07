import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { blogs } from "../utils/blogs";

const Container = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 28px 16px 80px;
`;
const Article = styled.article`
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
`;
const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 22px;
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const Category = styled.div`
  margin-bottom: 9px;
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
`;
const Title = styled.h1`
  max-width: 760px;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 40px;
  line-height: 1.15;
  @media (max-width: 600px) {
    font-size: 30px;
  }
`;
const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin: 16px 0 24px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
`;
const Cover = styled.img`
  display: block;
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 1px 8px 24px ${({ theme }) => theme.primary + 18};
`;
const Content = styled.div`
  max-width: 720px;
  margin: 34px auto 0;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 15px;
  line-height: 1.8;
`;
const SectionTitle = styled.h2`
  margin: 30px 0 10px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 23px;
  line-height: 1.3;
`;
const Paragraph = styled.p`
  margin: 0 0 16px;
`;
const Tips = styled.ul`
  margin: 0;
  padding-left: 22px;
`;
const Tip = styled.li`
  margin-bottom: 8px;
`;
const RelatedSection = styled.section`
  margin-top: 48px;
  padding-top: 26px;
  border-top: 1px solid ${({ theme }) => theme.text_primary + 20};
`;
const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
const RelatedCard = styled(Link)`
  display: block;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-3px);
  }
`;
const RelatedImage = styled.img`
  display: block;
  width: 100%;
  height: 120px;
  object-fit: cover;
`;
const RelatedTitle = styled.div`
  padding: 12px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
`;
const NotFound = styled.div`
  padding: 60px 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
`;

const BlogDetail = () => {
  const { slug } = useParams();
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <Container>
        <NotFound>
          Blog not found. <Link to="/blogs">Return to Blogs</Link>
        </NotFound>
      </Container>
    );
  }

  const relatedBlogs = blogs.filter((item) => item.slug !== blog.slug).slice(0, 3);

  return (
    <Container>
      <Article>
        <BackLink to="/blogs">&larr; Back to Blogs</BackLink>
        <Category>{blog.category}</Category>
        <Title>{blog.title}</Title>
        <Meta>
          <span>By {blog.author}</span>
          <span>{blog.date}</span>
          <span>{blog.readingTime}</span>
        </Meta>
        <Cover src={blog.image} alt={blog.title} />
        <Content>
          <SectionTitle>Introduction</SectionTitle>
          <Paragraph>{blog.introduction}</Paragraph>
          <SectionTitle>Main Content</SectionTitle>
          {blog.content.map((paragraph) => (
            <Paragraph key={paragraph}>{paragraph}</Paragraph>
          ))}
          <SectionTitle>Key Takeaways</SectionTitle>
          <Tips>
            {blog.tips.map((tip) => (
              <Tip key={tip}>{tip}</Tip>
            ))}
          </Tips>
        </Content>
        <RelatedSection>
          <SectionTitle>Related Blogs</SectionTitle>
          <RelatedGrid>
            {relatedBlogs.map((relatedBlog) => (
              <RelatedCard key={relatedBlog.slug} to={`/blogs/${relatedBlog.slug}`}>
                <RelatedImage src={relatedBlog.image} alt={relatedBlog.title} />
                <RelatedTitle>{relatedBlog.title}</RelatedTitle>
              </RelatedCard>
            ))}
          </RelatedGrid>
        </RelatedSection>
      </Article>
    </Container>
  );
};

export default BlogDetail;
