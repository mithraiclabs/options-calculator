import { TableContainer, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import { Greeks, OptionData } from "@/types/price";

interface GreeksTableProps {
  data: Array<[OptionData, OptionData]>;
}

const GreeksTable: React.FC<GreeksTableProps> = ({ data }) => {
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
              <Th>{call.greeks.rho}</Th>
              <Th>{call.greeks.vega}</Th>
              <Th>{call.greeks.theta}</Th>
              <Th>{call.greeks.gamma}</Th>
              <Th>{call.greeks.delta}</Th>
              <Th>{call.greeks.premium}</Th>
              <Th>{call.strike}</Th>
              <Th>{put.greeks.premium}</Th>
              <Th>{put.greeks.delta}</Th>
              <Th>{put.greeks.gamma}</Th>
              <Th>{put.greeks.theta}</Th>
              <Th>{put.greeks.vega}</Th>
              <Th>{put.greeks.rho}</Th>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default GreeksTable;
