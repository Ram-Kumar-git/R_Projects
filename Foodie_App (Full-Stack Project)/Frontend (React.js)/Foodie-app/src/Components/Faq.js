import { useState } from "react";

const FAQ = () => {
  const faqs = [
    { question: "How do I place an order on Foodie?", answer: "Open the Foodie app, select a restaurant, add items to your cart, proceed to checkout, enter your address, and make the payment." },
    { question: "How can I view my order?", answer: "After placing an order, you can view your order status  under the 'My Orders' section." },
    { question: "What payment methods does Foodie accept?", answer: "Currently, Foodie accepts payments via credit/debit cards and cash on delivery. UPI and Netbanking will be available soon." },
    { question: "How can I cancel an order?", answer: "You cannot cancel an order in the Foodie app. However, if you wish to cancel, you can refuse the order at the time of delivery. Your refund will be processed and reflected in your bank account within three business days." },
    { question: "How do I contact Foodie customer support?", answer: "Use the 'Help & Support' section in the app to chat with customer care." },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded-2xl shadow-lg" style={{ width: "70%", marginTop: "5%" }}>
      <h2 className="text-lg font-bold text-left mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2 flex flex-col items-center">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md w-3/4">
            <button
              className="w-full text-left text-base font-medium p-3 bg-white rounded-xl flex justify-between items-center focus:outline-none border border-gray-300"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{openIndex === index ? " ⏬" : " ⏩"}</span>
            </button>
            {openIndex === index && (
              <p className="p-3 text-gray-500 bg-white rounded-b-xl text-left">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;