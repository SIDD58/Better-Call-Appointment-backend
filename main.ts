
Deno.serve(async (req) => {
  const { record } = await req.json();
  const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

  console.log(`Bearer ${WHATSAPP_TOKEN}`)

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: record.customer_phone, 
        type: "text",
        text: {
          body: `Thanks ${record.customer_name}, Your Appointment is confirmed for ${record.appointment_date} Please arrive 10 minutes early.`,
        }
      }),
    }
  );

  // 1. CAPTURE THE VISIBILITY DATA
  const facebookData = await response.json();

  // 2. PRINT TO TERMINAL
  console.log("--- FACEBOOK API RESPONSE ---");
  console.log(JSON.stringify(facebookData, null, 2));

  // 3. RETURN DATA TO POSTMAN WINDOW
  return new Response(
    JSON.stringify({
      server_status: "Processed",
      facebook_status: response.status,
      facebook_ok: response.ok,
      facebook_payload: facebookData
    }), 
    { 
      status: response.status, 
      headers: { "Content-Type": "application/json" } 
    }
  );
});