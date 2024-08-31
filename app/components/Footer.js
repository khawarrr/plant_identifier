// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-green-800 text-white p-4 mt-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-sm">
              We are passionate about helping people identify and learn about
              plants using AI technology.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm">
              <li>
                <a href="/privacy" className="hover:text-green-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-green-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-green-200">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
            <p className="text-sm">
              Follow us on social media for plant identification tips and nature
              photography.
            </p>
            {/* Add social media icons here if desired */}
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          © {new Date().getFullYear()} Plant Identifier. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
