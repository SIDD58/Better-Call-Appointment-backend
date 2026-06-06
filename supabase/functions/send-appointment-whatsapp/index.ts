// THIS WILL ONLY WORD IF DEPLOYED AS IT EXPECT A RECORD FROM THE DATABASE WHICH WILL BE PROVIDED BY WEBHOOK
Deno.serve(async (req) => {
  const payload = await req.json();
  const appointment = payload.record;
  console.log(appointment.customerName);
  console.log(appointment.phone);
  console.log(appointment.time);
  const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  console.log(`Bearer ${WHATSAPP_TOKEN}`);
  console.log(`https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`);

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: appointment.phone,
        type: "text",
        text: {
          body:
            `Thanks ${appointment.customerName}, Your Appointment is confirmed for ${appointment.time} Please arrive 10 minutes early.`,
        },
      }),
    },
  );

  // Debugging

  // 1. CAPTURE THE VISIBILITY DATA
  const facebookData = await response.json();

  // 2. PRINT TO TERMINAL
  console.log("--- FACEBOOK API RESPONSE ---");
  console.log(JSON.stringify(facebookData, null, 2));

  // 3. RETURN DATA TO POSTMAN
  return new Response(
    JSON.stringify({
      server_status: "Processed",
      facebook_status: response.status,
      facebook_ok: response.ok,
      facebook_payload: facebookData,
    }),
    {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    },
  );
});

// // Testing edge function without touching meta cloud api
// Deno.serve(async (req) => {
//   const payload = await req.json();
//   const appointment = payload.record;
//   console.log(appointment.customerName);
//   console.log(appointment.phone);
//   console.log(appointment.time);
//   return Response.json({
//     success: true,
//     receivedData: {
//       name: appointment.customerName,
//       phone: appointment.phone,
//       time: appointment.time,
//     },
//   });
// });
