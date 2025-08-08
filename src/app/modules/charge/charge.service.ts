import { TCharge } from "./charge.interface";
import { Charge } from "./charge.model";

const getCharge = async () => {
  const result = await Charge.findOne({ slug: "service-charge" });
  return result;
};

const updateCharge = async (payload: TCharge) => {
  const result = await Charge.findOneAndUpdate({ slug: "service-charge" }, {sendMoneyCost: payload.sendMoneyCost, withdrawalFeePercentage: payload.withdrawalFeePercentage}, {
    new: true,
    upsert: true,
  });
  return result;
};

export const ChargeServices = {
  getCharge,
  updateCharge,
};
