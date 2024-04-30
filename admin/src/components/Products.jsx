import React from "react";
import { Link } from "react-router-dom";

function Products() {
  return (
    <div className="h-screen">
      This is Products{" "}
      <Link to="/" className="underline">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default Products;
