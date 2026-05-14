export const sendEmail = async (options) => {
    // We use the Brevo HTTP API instead of SMTP to bypass Render's port blocking
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: {
                name: "DigiCric Support",
                email: process.env.SMTP_USER // Ensure this email is verified in Brevo
            },
            to: [
                {
                    email: options.email,
                }
            ],
            subject: options.subject,
            textContent: options.message,
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Brevo API Error:", errorData);
        throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
};
