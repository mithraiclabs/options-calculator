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
import { round } from "@/utils/math";

interface GreeksTableProps {
  data: OptionData[];
}

const GreeksTable: React.FC<GreeksTableProps> = ({ data }) => {
  const getBgColor = (data: OptionData, call: boolean) => {
    if (call) {
      return data.spot < data.strike ? "yellow.50" : "white";
    } else {
      return data.spot > data.strike ? "yellow.50" : "white";
    }
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th colSpan={6} textAlign="center">
              Call
            </Th>
            <Th></Th>
            <Th colSpan={6} textAlign="center">
              Put
            </Th>
          </Tr>
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
          {data.map((row, id) => (
            <Tr key={id}>
              <Td isNumeric bgColor={getBgColor(row, true)}>
                {round(row.call?.rho, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, true)}>
                {round(row.call?.vega, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, true)}>
                {round(row.call?.theta, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, true)}>
                {round(row.call?.gamma, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, true)}>
                {round(row.call?.delta, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, true)}>
                ${round(row.call?.premium, 2)}
              </Td>
              <Td isNumeric bgColor="gray.100">
                ${row.strike}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, false)}>
                ${round(row.put?.premium, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, false)}>
                {round(row.put?.delta, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, false)}>
                {round(row.put?.gamma, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, false)}>
                {round(row.put?.theta, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, false)}>
                {round(row.put?.vega, 2)}
              </Td>
              <Td isNumeric bgColor={getBgColor(row, false)}>
                {round(row.put?.rho, 2)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default GreeksTable;
