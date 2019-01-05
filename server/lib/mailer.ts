import sgMail from "@sendgrid/mail";
import { MailData } from "@sendgrid/helpers/classes/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendEmail(msg: MailData) {
  return sgMail.send([msg]);
}

export type EmailMessage = MailData;

