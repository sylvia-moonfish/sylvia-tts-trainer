import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  id: string;
  username: string;
  recordings: { [promptId: string]: string };
  useCustom: boolean;
  customPromptId: string;
  submittedForTraining: boolean;
}
