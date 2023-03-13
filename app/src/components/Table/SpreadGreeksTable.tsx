import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Tfoot,
} from "@chakra-ui/react";
import { SpreadOptionData } from "@/types/price";
import { round } from "@/utils/math";

interface SpreadGreeksTableProps {
  data: SpreadOptionData | null;
}

const SpreadGreeksTable: React.FC<SpreadGreeksTableProps> = ({ data }) => {
  return (
    <Box w="full" textAlign="center">
      <Text as="b" fontSize="lg" mb={2} py={3}>
        Spread Greeks Table
      </Text>
      {data && (
        <TableContainer w="full">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th colSpan={7} textAlign="center">
                  {data.buyStrike < data.sellStrike
                    ? "Call Spread"
                    : "Put Spread"}
                </Th>
              </Tr>
              <Tr>
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
              <Tr>
                <Td>${data.buyStrike}</Td>
                <Td>${round(data.buyGreeks.premium, 2)}</Td>
                <Td>{round(data.buyGreeks.delta, 2)}</Td>
                <Td>{round(data.buyGreeks.gamma, 2)}</Td>
                <Td>{round(data.buyGreeks.theta, 2)}</Td>
                <Td>{round(data.buyGreeks.vega, 2)}</Td>
                <Td>{round(data.buyGreeks.rho, 2)}</Td>
              </Tr>
              <Tr>
                <Td>${data.sellStrike}</Td>
                <Td>${round(data.sellGreeks.premium, 2)}</Td>
                <Td>{round(data.sellGreeks.delta, 2)}</Td>
                <Td>{round(data.sellGreeks.gamma, 2)}</Td>
                <Td>{round(data.sellGreeks.theta, 2)}</Td>
                <Td>{round(data.sellGreeks.vega, 2)}</Td>
                <Td>{round(data.sellGreeks.rho, 2)}</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Td></Td>
                <Td>
                  ${round(data.buyGreeks.premium - data.sellGreeks.premium, 2)}
                </Td>
                <Td>
                  {round(data.buyGreeks.delta - data.sellGreeks.delta, 2)}
                </Td>
                <Td>
                  {round(data.buyGreeks.gamma - data.sellGreeks.gamma, 2)}
                </Td>
                <Td>
                  {round(data.buyGreeks.theta - data.sellGreeks.theta, 2)}
                </Td>
                <Td>{round(data.buyGreeks.vega - data.sellGreeks.vega, 2)}</Td>
                <Td>{round(data.buyGreeks.rho - data.sellGreeks.rho, 2)}</Td>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SpreadGreeksTable;
