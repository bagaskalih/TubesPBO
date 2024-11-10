import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-max bg-gray-100 min-w-full">
      <div className="p-8 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-4">
          Hello World
        </h1>
        <p className="text-gray-700 text-center">{message}</p>
      </div>
    </div>
  );
}

export default App;
