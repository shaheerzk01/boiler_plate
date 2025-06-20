import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "finalyear21a@gmail.com",
    pass: "cgni uhjq ovvz msaq",
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: '"Demo Account" <finalyear21a@gmail.com>', 
    to,
    subject: "Verify Your Account",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions)
};
