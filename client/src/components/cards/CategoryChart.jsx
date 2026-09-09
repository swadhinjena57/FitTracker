import React from "react";
import styled from "styled-components";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "styled-components";

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
const ChartFrame = styled.div`
  .MuiCharts-root text,
  .MuiCharts-root tspan,
  svg text,
  svg tspan {
    fill: ${({ isDark, theme }) => (isDark ? `${theme.white} !important` : `${theme.text_secondary} !important`)};
  }
`;

const CategoryChart = ({ data }) => {
  const theme = useTheme();
  return (
    <Card>
      <Title>Calories by Category</Title>
      {data?.pieChartData && (
        <ChartFrame isDark={theme.isDark}>
          <PieChart
            series={[
              {
                data: data?.pieChartData,
                innerRadius: 30,
                outerRadius: 120,
                paddingAngle: 5,
                cornerRadius: 5,
              },
            ]}
            sx={{
              "& text, & tspan, & .MuiChartsLegend-label": { fill: `${theme.isDark ? theme.white : theme.text_secondary} !important` },
            }}
            height={300}
          />
        </ChartFrame>
      )}
    </Card>
  );
};

export default CategoryChart;
