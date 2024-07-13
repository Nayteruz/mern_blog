import { CircularProgressbar } from "react-circular-progressbar";
import { CircularProgressbarStyles } from "react-circular-progressbar/dist/types";
import "react-circular-progressbar/dist/styles.css";

interface ICircularProgressProps {
  value: number;
  text: string;
  styles?: CircularProgressbarStyles | undefined;
}

export const CircularProgress = ({
  value,
  text,
  styles,
}: ICircularProgressProps) => {
  return <CircularProgressbar value={value} text={text} styles={styles} />;
};
