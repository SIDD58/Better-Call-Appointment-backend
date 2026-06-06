// This is Local version of Edge Function 
// Webhook URL (Edge Function) is given input paramters which can be properly 
// tested in the supabase platform

// The Main file here is supabase/functions/send-appointment-whatsapp/index.js


Deno.serve(async (req) => {
  const staticCustomerPhone = "919803037008"; // Must include country code, no "+" sign
  const staticCustomerName = "John steve";
  const staticAppointmentDate = "June 14, 2026";

  const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  console.log(`Bearer ${WHATSAPP_TOKEN}`);

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
        to: staticCustomerPhone,
        type: "text",
        text: {
          body: `Getter ${staticCustomerName} and ${staticAppointmentDate}`,
        },
      }),
    },
  );

  // 1. capture the visiblity data
  const facebookData = await response.json();

  // 2. print on terminal
  console.log("Meta API RESPONSE");
  console.log(JSON.stringify(facebookData, null, 2));

  // 3. return data (postman)
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
