import { MANUFACTUR } from "@/interfaces/console";
import Joystick from "@/models/joystick";

export const showAllJoystick = ({
  manufactur,
}: {
  manufactur?: MANUFACTUR;
}): Promise<Joystick[]> => {
  return new Promise((resolve, reject) => {
    Joystick.findAll({ where: manufactur ? { manufactur } : undefined })
      .then((res) => resolve(res))
      .catch((err) => resolve(err));
  });
};
