import { TContactUs } from "./contactus.interface";
import { ContactUs } from "./contactus.model";

const create = async (payload: TContactUs) => {
    const result = await ContactUs.create(payload);
    return result;
};

const getAll = async () => {
    const result = await ContactUs.find().sort({ createdAt: -1 });
    return result;
};

export const ContactUsServices = {
    create,
    getAll,
};
