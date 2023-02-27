import { PriceData } from "@/types/price";
import { capitalise } from "@/utils/strings";
import { VStack, Text } from "@chakra-ui/react";
import moment from "moment";
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

const dateFormatter = (date: Date) => {
  return moment(date).format("DD MMM");
};

const PriceChart: React.FC<PriceChartProps> = ({ token, data }) => {
  const values = data.map((obj) => {
    return obj.price;
  });
  const min = Math.floor(Math.min(...values));
  const max = Math.ceil(Math.max(...values));

  return (
    <VStack width="100%">
      <Text as="b" fontSize="lg" mb={2} py={3}>
        {capitalise(token)} Price Chart
      </Text>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart width={600} data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey={"date"} scale="time" tickFormatter={dateFormatter} />
          <YAxis domain={[min, max]} />
          <Line
            connectNulls
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            dot={false}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </VStack>
  );
};

export default PriceChart;
