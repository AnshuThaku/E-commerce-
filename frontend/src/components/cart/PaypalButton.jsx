import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PaypalButton({ amount, onSuccess, onError }) {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error("Error: PayPal Client ID is missing.");
    return <p>PayPal integration is currently unavailable.</p>;
  }

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          const formattedAmount = parseFloat(amount);
          if (isNaN(formattedAmount)) {
            console.error("Error: Invalid amount provided for PayPal.");
            return;
          }
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: formattedAmount.toFixed(2) },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order
            .capture()
            .then(onSuccess)
            .catch((err) => {
              console.error("Error capturing payment:", err);
              onError(err);
            });
        }}
        onError={(err) => {
          alert("Payment failed, please try again.");
          console.error("PayPal Error:", err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
