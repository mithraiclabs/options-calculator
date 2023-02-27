import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Text,
} from "@chakra-ui/react";

interface ExpirationInputProps {
  value: number;
  onChange: (nextValue: number) => void;
}

const ExpirationInput: React.FC<ExpirationInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <Box>
      <Slider
        aria-label="slider-ex-1"
        defaultValue={value}
        onChange={onChange}
        min={1}
        max={365}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>{value} days</Text>
    </Box>
  );
};

export default ExpirationInput;
