import { useState } from "react";
import { storageService } from "../../../utils/validators";
import { AOC_STORAGE_CONSTANTS } from "./constants";

const useAocDataHook = () => {
  const planData = storageService().getObject(
    AOC_STORAGE_CONSTANTS.AOC_DATA
  ) || {
    amount: 200,
    total_amount: 300,
    gst: 100,
  };

  const [aocData, setAocData] = useState(planData);

  return {
    aocData,
    setAocData,
  };
};

export default useAocDataHook;
