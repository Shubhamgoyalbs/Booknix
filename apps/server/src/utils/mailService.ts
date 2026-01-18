import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY!;

//todo
const resend = new Resend(apiKey);

(async function () {
  const { data, error } = await resend.emails.send({
    from: "Booknix <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello World",
    html: "<strong>It works!</strong>",
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
