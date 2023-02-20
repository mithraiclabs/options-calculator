import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Greeks, OptionData } from "@/types/price";

interface GreeksTableProps {
  data: Array<[OptionData, OptionData]>;
}

const GreeksTable: React.FC<GreeksTableProps> = ({ data }) => {
  data = [
    [
      {
        symbol: "sol",
        type: "call",
        expiry: new Date(),
        strike: 19,
        greeks: {
          premium: 0.1,
          delta: 0.1,
          gamma: 0.1,
          theta: 0.1,
          vega: 0.1,
          rho: 0.1,
        },
      },
      {
        symbol: "sol",
        type: "put",
        expiry: new Date(),
        strike: 19,
        greeks: {
          premium: 0.1,
          delta: 0.1,
          gamma: 0.1,
          theta: 0.1,
          vega: 0.1,
          rho: 0.1,
        },
      },
    ],
    [
      {
        symbol: "sol",
        type: "call",
        expiry: new Date(),
        strike: 19,
        greeks: {
          premium: 0.1,
          delta: 0.1,
          gamma: 0.1,
          theta: 0.1,
          vega: 0.1,
          rho: 0.1,
        },
      },
      {
        symbol: "sol",
        type: "put",
        expiry: new Date(),
        strike: 19,
        greeks: {
          premium: 0.1,
          delta: 0.1,
          gamma: 0.1,
          theta: 0.1,
          vega: 0.1,
          rho: 0.1,
        },
      },
    ],
  ];

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Rho</Th>
            <Th>Vega</Th>
            <Th>Theta</Th>
            <Th>Gamma</Th>
            <Th>Delta</Th>
            <Th>Premium</Th>
            <Th>Strike Price</Th>
            <Th>Premium</Th>
            <Th>Delta</Th>
            <Th>Gamma</Th>
            <Th>Theta</Th>
            <Th>Vega</Th>
            <Th>Rho</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(([call, put], id) => (
            <Tr key={id}>
              <Td isNumeric>{call.greeks.rho}</Td>
              <Td isNumeric>{call.greeks.vega}</Td>
              <Td isNumeric>{call.greeks.theta}</Td>
              <Td isNumeric>{call.greeks.gamma}</Td>
              <Td isNumeric>{call.greeks.delta}</Td>
              <Td isNumeric>{call.greeks.premium}</Td>
              <Td
                isNumeric
                css={{
                  background: "#FEEBC8",
                }}
              >
                {call.strike}
              </Td>
              <Td isNumeric>{put.greeks.premium}</Td>
              <Td isNumeric>{put.greeks.delta}</Td>
              <Td isNumeric>{put.greeks.gamma}</Td>
              <Td isNumeric>{put.greeks.theta}</Td>
              <Td isNumeric>{put.greeks.vega}</Td>
              <Td isNumeric>{put.greeks.rho}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default GreeksTable;
