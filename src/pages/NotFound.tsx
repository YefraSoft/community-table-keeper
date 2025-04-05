
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: Requested page not found");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Página no encontrada</p>
        <Button variant="default" onClick={() => window.location.reload()}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
