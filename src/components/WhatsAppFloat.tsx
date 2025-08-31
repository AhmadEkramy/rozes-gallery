
export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/01515695312"
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-110 duration-300"
        aria-label="Chat on WhatsApp"
      >
        <div className="w-16 h-16 flex items-center justify-center relative">
          {/* Green circle background */}
          <div className="absolute inset-0 bg-[#25D366] rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)]"></div>
          
          {/* WhatsApp Official SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-9 h-9 relative z-10 fill-white"
          >
            <path d="M12.012 2c5.518 0 9.997 4.48 9.997 9.997 0 5.518-4.479 9.998-9.997 9.998-1.748 0-3.645-.482-5.25-1.392l-4.494 1.497 1.497-4.494C2.482 15.637 2 13.74 2 11.992 2 6.474 6.479 2 12.012 2zM8.927 7.306c-.126-.273-.272-.346-.519-.391-.159-.029-.36-.054-.549-.054-.296 0-.58.089-.785.285-.243.232-.947.924-1.019 2.244-.073 1.321.761 2.6.869 2.777.112.183 1.538 2.446 3.802 3.507 1.878.871 2.263.698 2.672.655.407-.044 1.316-.539 1.502-1.058.184-.519.201-.965.155-1.069-.047-.104-.173-.167-.363-.293-.189-.125-1.143-.563-1.321-.626-.189-.068-.317-.099-.457.1-.14.197-.549.626-.674.752-.122.126-.25.143-.44.018-.189-.125-.794-.293-1.513-.932-.56-.475-.94-1.062-1.048-1.242-.109-.179-.012-.276.082-.363.083-.079.189-.207.284-.311.095-.104.126-.178.189-.297.062-.119.028-.223-.016-.312-.044-.089-.428-1.02-.587-1.396l-.015-.03z"/>
          </svg>

          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-75"></div>
        </div>
      </a>
    </div>
  );
}
