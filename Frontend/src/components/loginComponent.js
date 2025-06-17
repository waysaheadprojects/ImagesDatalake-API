import imageLogo from "../assets/images/imagelogo.png";

const LoginComponent = ({
  setEmail,
  setPassword,
  handleLogin,
  email,
  password,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-5xl">
        <div className="w-full max-w-xl p-8">
          <img src={imageLogo} alt="Logo" className="h-16 mx-auto mb-4" />
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>

        <div className="hidden md:block w-1/2 bg-gray-100 p-8 border-l-2 border-gray-300">
          <h2 data-start="912" data-end="947">
            ✅{" "}
            <strong data-start="917" data-end="945">
              Release 1 &ndash; 15 June 2025
            </strong>
          </h2>
          <p data-start="992" data-end="1122">
            Search and Retrieval of content from past events (w.e.f. PRC 2024).
          </p>
          <br />
          <h2 data-start="1407" data-end="1442">
            ✅{" "}
            <strong data-start="1412" data-end="1440">
              Release 2 &ndash; 30 June 2025
            </strong>
          </h2>
          <p data-start="1497" data-end="1610">
            Insight-driven visual discovery with access controls
            tailored to organizational roles.
          </p>
          <br />
          <h2 data-start="1965" data-end="2001">
            🔄{" "}
            <strong data-start="1971" data-end="1999">
              Release 3 &ndash; 15 July 2025
            </strong>
          </h2>
          <p data-start="2049" data-end="2179">
            Search, Extract, and Interact with key video
            segments using smart tagging and contextual mapping.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
