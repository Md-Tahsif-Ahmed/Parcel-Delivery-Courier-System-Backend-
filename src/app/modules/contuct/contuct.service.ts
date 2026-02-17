import { IContact } from "./contuct.interface";
import { ContactModel } from "./contuct.model";

 

const createContactToDB = async (payload: IContact) => {
  const isExist = await ContactModel.findOne();
  if (isExist) {
    throw new Error("Contact info already exists");
  }

  const result = await ContactModel.create(payload);
  return result;
};

const getContactFromDB = async () => {
  return ContactModel.findOne();
};

const updateContactInDB = async (payload: Partial<IContact>) => {
  const result = await ContactModel.findOneAndUpdate(
    {},
    payload,
    { new: true }
  );
  return result;
};

const deleteContactFromDB = async () => {
  return ContactModel.findOneAndDelete();
};

export const ContactService = {
  createContactToDB,
  getContactFromDB,
  updateContactInDB,
  deleteContactFromDB,
};
