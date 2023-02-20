import { HStack, useRadioGroup } from "@chakra-ui/react";
import RadioButton from "./RadioButton";

interface RadioGroupProps {
  options: string[];
  value: string;
  onChange: (nextValue: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "time range",
    defaultValue: value,
    value: value,
    onChange: onChange,
  });

  return (
    <HStack spacing={2} w="100%">
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioButton key={value} {...radio}>
            {value}
          </RadioButton>
        );
      })}
    </HStack>
  );
};

export default RadioGroup;
