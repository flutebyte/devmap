function Footer() {
  return (
    <footer className="bg-gray-100 py-12 px-10">
      <div className="grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-xl font-bold text-blue-600">DevMap</h2>
          <p className="text-gray-500 mt-2">
            AI-powered learning platform for smart students.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Product</h3>
          <p className="text-gray-500">Features</p>
          <p className="text-gray-500">How it Works</p>
          <p className="text-gray-500">Login</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Connect</h3>
          <p className="text-gray-500">Twitter</p>
          <p className="text-gray-500">LinkedIn</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;