import Mailgen from "mailgen";

export interface SendEmailOptions {
    email: string;
    subject: string;
    mailgenContent: Mailgen.Content;
}
