import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import MainLayout from "./Layout/MainLayout";

interface RankingData {
  username: string;
  totalResponses: number;
  completionRate: number;
}

interface CategoryStats {
  categoryName: string;
  responseCount: number;
}

interface RankingProps {
  username: string;
  role: string;
}

const Rankings: React.FC<RankingProps> = ({ username, role }) => {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rankingsRes, statsRes] = await Promise.all([
        axios.get("http://localhost:8081/api/rankings"),
        axios.get("http://localhost:8081/api/surveys/stats/categories"),
      ]);

      console.log(rankingsRes.data);

      setRankings(rankingsRes.data);
      setCategoryStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const maxValue =
    Math.ceil(
      Math.max(...categoryStats.map((stat) => stat.responseCount)) / 2
    ) * 2;
  const yAxisTicks = Array.from({ length: maxValue / 2 + 1 }, (_, i) => i * 2);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm">
          <p>{`${payload[0].payload.categoryName}`}</p>
          <p>{`Response Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout username={username} role={role}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Survey Analytics
        </Typography>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart width={600} height={300} data={categoryStats}>
                  <XAxis dataKey="categoryName" stroke="#8884d8" />
                  <YAxis ticks={yAxisTicks} />
                  <Tooltip
                    wrapperStyle={{
                      width: 200,
                      backgroundColor: "grey",
                      padding: 10,
                    }}
                    content={<CustomTooltip />}
                  />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Bar dataKey="responseCount" fill="#8884d8" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Rankings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell align="right">Completion Rate (%)</TableCell>
                    <TableCell align="right">Surveys Completed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankings.map((user, index) => (
                    <TableRow key={user.username}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell align="right">{`${(user.completionRate * 100).toFixed(1)}%`}</TableCell>
                      <TableCell align="right">{user.totalResponses}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default Rankings;
