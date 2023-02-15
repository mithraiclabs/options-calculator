import { PriceData } from "@/types/price";
import { VStack, Text } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PriceChartProps {
  token: string;
  data: PriceData[];
}

const PriceChart: React.FC<PriceChartProps> = ({ token, data }) => {
  return (
    <VStack width="100%">
      <Text as="h3" fontSize={"lg"} fontWeight={400} mb={2} py={3}>
        {token} price
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart width={600} height={300} data={data}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </VStack>
  );
};

export default PriceChart;
