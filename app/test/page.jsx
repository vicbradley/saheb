"use client";
import { useEffect, useState } from "react";
import openSocket from "socket.io-client";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = openSocket("http://localhost:5000", { transports: ["websocket"] });
    console.log("berulang")

    socket.on("products", (data) => {
      setProducts(data);
      setLoading(false);
    });

    socket.on("error", (error) => {
      setError(error);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Real-time Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {products.map((product) => (
          <div key={product.id}>
            <li className="font-semibold">{product.name}</li>
            <li>{product.price}</li>
          </div>
        ))}
      </ul>
      <button onClick={() => router.push("/products")}>Go to Products</button>
    </div>
  );
}
