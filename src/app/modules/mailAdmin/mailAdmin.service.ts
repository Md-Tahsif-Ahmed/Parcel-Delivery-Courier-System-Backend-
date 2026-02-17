import { emailHelper } from "../../../helpers/emailHelper";
import { emailTemplate } from "../../../shared/emailTemplate";
import { IContactEmailValues, IContactMessage } from "../../../types/emailTemplate";

export const ContactService = {
  sendContactMessage: async (payload: IContactMessage): Promise<{ message: string }> => {
 
    const emailValues: IContactEmailValues = {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    };
    const contactTemplate = emailTemplate.contactMessage(emailValues);
    await emailHelper.sendEmail(contactTemplate);

    return { message: 'Message sent successfully' };
  },
};