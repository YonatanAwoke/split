import { useEffect, useState } from 'react';
import { DollarSign, Menu, Split, Wallet, Wind, X } from 'lucide-react';
import axios from 'axios';

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const [backendMessage, setBackendMessage] = useState('');

  const [mapImageUrl, setMapImageUrl] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFrom, setSelectedFrom] = useState<{ text: string; longitude: number; latitude: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTo, setSelectedTo] = useState<{ text: string; longitude: number; latitude: number } | null>(null);
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:8000/api/test')
      .then((response) => {
        setBackendMessage(response.data.message);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

      const centerCoordinates = '38.7533,9.0351'; // lng,lat
      const zoomLevel = 12.91; // Map zoom level
      const mapStyle = 'streets-v12'; // Mapbox style
      const imageSize = '1080x720'; // Image dimensions (width x height)
  
      const url = `https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/${centerCoordinates},${zoomLevel},0/${imageSize}?access_token=${accessToken}`;
      setMapImageUrl(url);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-y-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);


  const handleSearch = (query: string | number | boolean, type: string) => {
    // Define optional parameters
    const proximity = '40.489673,9.145'; // Example: Longitude,Latitude for Ethiopia
    const language = ['en', 'am']; // Change to 'am' for Amharic if needed
    const country = 'ET'; // ISO 3166-1 alpha-2 code for Ethiopia
  
    // Construct the API URL with the additional parameters
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${accessToken}&autocomplete=true&limit=5&proximity=${proximity}&language=${language}&country=${country}`;
  
    axios
      .get(url)
      .then((response) => {
        setSuggestions((prev) => ({
          ...prev,
          [type]: response.data.features.map((feature: { place_name: string; center: number[] }) => ({
            text: feature.place_name,
            longitude: feature.center[0],
            latitude: feature.center[1],
          })),
        }));
      })
      .catch((error) => {
        console.error('Error fetching location suggestions:', error);
      });
  };
  
  

  const handleSelect = (location: { text: string; longitude: number; latitude: number }, type: string) => {
    if (type === 'from') {
      setSelectedFrom(location);
      setFrom(location.text); 
    } else if (type === 'to') {
      setSelectedTo(location);
      setTo(location.text); 
    }
    setSuggestions((prev) => ({ ...prev, [type]: [] })); 
  };

  return (
    <div className="min-h-screen bg-teal-900 relative">
      {/* Interactive Map Background */}
      {mapImageUrl && (
        <div
          className="absolute inset-0 opacity-10 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${mapImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/80 z-20 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 right-0 w-64 bg-teal-900 p-6 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col space-y-6 mt-12">
            <a href="#" className="text-white hover:text-gray-300">Home</a>
            <a href="#" className="text-white hover:text-gray-300">Features</a>
            <a href="#" className="text-white hover:text-gray-300">Pricing</a>
            <a href="#" className="text-white hover:text-gray-300">Contact</a>
            <a href="#" className="text-white hover:text-gray-300">Blog</a>
            <button className="bg-white text-teal-900 px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center space-x-2 text-white">
          <Split className="h-6 w-6" />
          <span className="font-bold text-xl">Split</span>
        </div>
        <div className="hidden md:flex space-x-8 text-gray-300">
          <a href="#" className="hover:text-white">Home</a>
          <a href="#" className="hover:text-white">Features</a>
          <a href="#" className="hover:text-white">Pricing</a>
          <a href="#" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">Blog</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-transparent border border-white text-white px-4 md:px-6 py-2 rounded-full hover:bg-white hover:text-teal-900 transition-colors hidden md:block">
            Sign In
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 pt-12 md:pt-20">

        {/* Hero Text */}
        <h1 className="text-white text-center text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Ride Together,<br />Save Together.
        </h1>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-base px-4">
            Split your taxi fare with travelers heading the same way. Affordable, comfortable, and secure rides—every time
        </p>
        <p className="text-white text-center">{backendMessage}</p>

        {/* Search Inputs */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8 md:mb-12 px-4">
        <div className="relative">
        <input
          type="text"
          placeholder="From"
          className="w-full md:w-64 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          value={from}
          onChange={(e) => {
            const inputValue = e.target.value;
            setFrom(inputValue);

            if (inputValue.trim() === '') {
              setSuggestions((prev) => ({ ...prev, from: [] }));
            } else {
              handleSearch(inputValue, 'from');
            }
          }}
        />
          {suggestions.from.length > 0 && (
            <ul className="absolute bg-white w-full rounded shadow mt-1 max-h-40 overflow-y-auto z-10">
              {suggestions.from.map((location: { text: string; longitude: number; latitude: number }, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(location, 'from')}
                >
                  {location.text}
                </li>
              ))}
            </ul>
          )}
        </div>
          <div className="relative">
          <input
            type="text"
            placeholder="To"
            className="w-full md:w-64 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
            value={to}
            onChange={(e) => {
              const inputValue = e.target.value;
              setTo(inputValue);

              if (inputValue.trim() === '') {
                setSuggestions((prev) => ({ ...prev, to: [] }));
              } else {
                handleSearch(inputValue, 'to');
              }
            }}
          />
            {suggestions.to.length > 0 && (
              <ul className="absolute bg-white w-full rounded shadow mt-1 max-h-40 overflow-y-auto z-10">
                {suggestions.to.map((location: { text: string; longitude: number; latitude: number }, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(location, 'to')}
                  >
                    {location.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="w-full md:w-auto px-8 py-3 bg-white text-teal-900 rounded-lg font-semibold hover:bg-white/90 transition-colors">
            Go
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl p-6 transform hover:scale-105 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Money Saved</p>
                <p className="text-2xl font-bold">125,000+ ETB </p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>Riders saved by sharing rides</span>
              <DollarSign className="ml-auto text-green-500" />
            </div>
          </div>

          {/* Euro Card */}
          <div className="bg-white rounded-2xl p-6 transform hover:scale-105 transition-transform">
            <p className="text-sm text-gray-600 mb-2">Average Savings Per Ride</p>
            <p className="text-2xl font-bold mb-4">Up to 50%</p>
            <div className="flex items-center text-sm text-gray-600">
              <span>With every shared ride</span>
              <Wallet className="ml-auto text-green-500" />
            </div>
          </div>

          {/* Savings Card */}
          <div className="bg-white rounded-2xl p-6 transform hover:scale-105 transition-transform md:col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-600 mb-2">Environmental Impact</p>
            <p className="text-2xl font-bold text-green-600">5,000+ kg of CO₂</p>
            <div className="mt-4">
              <div className='flex items-center text-sm text-grey-600'>
                <span>Emissions reduced by sharing rides</span>
                <Wind className="ml-auto text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-6 md:gap-12 opacity-50 px-4">
          {['Ride', 'Feres', 'Zay Ride', 'Yango', 'Little Ethiopia', 'Seregela', 'Easy Ride', 'Adika', 'VIP Taxi'].map((partner) => (
            <span key={partner} className="text-white text-sm">{partner}</span>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;