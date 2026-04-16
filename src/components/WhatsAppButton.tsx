'use client';

export default function WhatsAppButton() {
  const whatsappLink = "https://wa.me/436767901777?text=Hallo!%20Ich%20interessiere%20mich%20für%20Hochzeitsfotografie";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Kontaktiere uns über WhatsApp"
      className="whatsapp-button"
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.004 0C7.165 0 0 7.163 0 16c0 2.825.737 5.58 2.14 8.007L0 32l8.188-2.09A15.93 15.93 0 0 0 16.004 32C24.837 32 32 24.837 32 16S24.837 0 16.004 0zm0 29.09a13.05 13.05 0 0 1-6.64-1.813l-.477-.283-4.94 1.263 1.32-4.823-.31-.494A13.01 13.01 0 0 1 2.91 16C2.91 8.77 8.77 2.91 16.004 2.91S29.09 8.77 29.09 16s-5.86 13.09-13.086 13.09zm7.175-9.8c-.393-.197-2.328-1.148-2.689-1.28-.36-.13-.623-.196-.886.197-.263.394-1.018 1.28-1.248 1.543-.23.263-.46.296-.853.099-.393-.197-1.66-.612-3.163-1.95-1.17-1.04-1.96-2.326-2.19-2.72-.23-.393-.024-.606.173-.802.177-.176.393-.46.59-.69.197-.23.263-.394.394-.657.131-.263.066-.493-.033-.69-.099-.197-.886-2.135-1.214-2.923-.32-.768-.645-.664-.886-.676l-.755-.013c-.263 0-.69.099-1.051.493-.36.394-1.378 1.346-1.378 3.284s1.41 3.81 1.607 4.073c.197.263 2.775 4.24 6.725 5.946.94.405 1.673.647 2.244.828.943.3 1.8.257 2.478.156.756-.113 2.328-.952 2.656-1.871.328-.92.328-1.707.23-1.871-.099-.165-.362-.263-.755-.46z"/>
      </svg>

      <style jsx>{`
        .whatsapp-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          background-color: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 9999;
          text-decoration: none;
        }

        .whatsapp-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
        }

        .whatsapp-button svg {
          width: 32px;
          height: 32px;
        }

        @media (max-width: 768px) {
          .whatsapp-button {
            width: 50px;
            height: 50px;
            bottom: 16px;
            right: 16px;
          }

          .whatsapp-button svg {
            width: 26px;
            height: 26px;
          }
        }
      `}</style>
    </a>
  );
}
