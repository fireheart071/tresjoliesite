import './WhatsAppButton.css';

const WHATSAPP_NUMBER = '233000000000';
const MESSAGE = encodeURIComponent(
  'Hi! I would like to shop your clothing and jewelry collection.'
);

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-button"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="whatsapp-icon"
        viewBox="0 0 32 32"
        role="img"
        aria-hidden="true"
      >
        <path d="M19.11 17.21c-.24-.12-1.4-.69-1.62-.76-.22-.08-.38-.12-.53.12-.16.23-.61.76-.75.92-.14.15-.28.18-.52.06-.24-.12-1.02-.37-1.95-1.17-.72-.64-1.21-1.43-1.35-1.67-.14-.23-.01-.36.1-.47.11-.1.24-.27.36-.4.12-.14.16-.24.24-.4.08-.15.04-.29-.02-.4-.06-.12-.53-1.28-.72-1.74-.19-.46-.38-.4-.53-.4h-.46c-.16 0-.4.06-.61.29-.22.24-.82.8-.82 1.95s.84 2.27.95 2.43c.12.16 1.65 2.52 4 3.53.56.24 1 .38 1.34.49.56.18 1.07.15 1.48.09.45-.07 1.4-.57 1.6-1.12.2-.56.2-1.03.14-1.12-.06-.1-.22-.16-.46-.28Z" />
        <path d="M16 3a13 13 0 0 0-11.3 19.42L3 29l6.77-1.77A13 13 0 1 0 16 3Zm0 23.64c-2.04 0-3.95-.55-5.6-1.5l-.4-.23-4.02 1.05 1.07-3.92-.26-.41a10.64 10.64 0 1 1 9.2 5.01Z" />
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}
