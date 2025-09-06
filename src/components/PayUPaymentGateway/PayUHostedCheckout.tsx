import React, { useEffect, useState } from "react";

interface PaymentData {
  amount: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  productinfo: string;
}

interface PayUResponse extends PaymentData {
  key: string;
  txnid: string;
  surl: string;
  furl: string;
  hash: string;
}

interface PayUFormStaticProps {
  paymentData: PaymentData;
  autoSubmit?: boolean;
}

const PayUFormStatic: React.FC<PayUFormStaticProps> = ({ paymentData, autoSubmit = false }) => {
  const [payuData, setPayuData] = useState<PayUResponse | null>(null);

  useEffect(() => {
    if (autoSubmit && paymentData) {
      fetch("http://localhost:8000/api/payu/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      })
        .then((res) => res.json())
        .then((data: PayUResponse) => setPayuData(data))
        .catch((err) => console.error("Payment Error:", err));
    }
  }, [autoSubmit, paymentData]);

  useEffect(() => {
    if (payuData && autoSubmit) {
      const form = document.getElementById("payu-static-form") as HTMLFormElement;
      if (form) {
        form.submit();
      }
    }
  }, [payuData, autoSubmit]);
  console.log("PayU Data:", payuData);

  if (!payuData) return null;

  return (
    <form
      id="payu-static-form"
      method="POST"
      action="https://test.payu.in/_payment"
    >
      <input type="hidden" name="key" value={payuData.key} />
      <input type="hidden" name="txnid" value={payuData.txnid} />
      <input type="hidden" name="productinfo" value={payuData.productinfo} />
      <input type="hidden" name="amount" value={payuData.amount} />
      <input type="hidden" name="firstname" value={payuData.firstname} />
      <input type="hidden" name="lastname" value={payuData.lastname} />
      <input type="hidden" name="email" value={payuData.email} />
      <input type="hidden" name="phone" value={payuData.phone} />
      <input type="hidden" name="surl" value={payuData.surl} />
      <input type="hidden" name="furl" value={payuData.furl} />
      <input type="hidden" name="hash" value={payuData.hash} />
      <input type="submit" value="Proceed to PayU" />
    </form>
  );
};

export default PayUFormStatic;
