export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Welcome to BioWe
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your trusted source for premium organic gardening products
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Welcome to your BioWe dashboard. Here you'll find everything you need
              to manage your gardening products and orders.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
