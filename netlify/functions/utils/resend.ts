import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface EmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailParams): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Profile Optimizer <notifications@ericphiferllc.com>',
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
