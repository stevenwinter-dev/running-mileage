import { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [totalMiles, setTotalMiles] = useState<number | null>(null);

  const convertImageToText = async () => {
    if (selectedImage) {
      const worker = await createWorker({
        logger: (m) => console.log(m),
      });
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const { data } = await worker.recognize(selectedImage);
      console.log(data);
      const milesRegex = /\d+(.\d+)?\s*(miles|mi)/i;
      const match = data.text.match(milesRegex);
      if (match) {
        const milesStr = match[0].match(/\d+(\.\d+)?/)?.[0];
        if (milesStr) {
          const miles = parseFloat(milesStr);
          setTotalMiles(miles);
        }
      }
    }
  };

  useEffect(() => {
    convertImageToText();
  }, [selectedImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(e.target.files?.[0] || null);
    setTotalMiles(null);
  };

  return (
    <main className="h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 flex justify-center items-center text-gray-800 tracking-wider">
      <section className="w-full max-w-lg mx-auto bg-white rounded-lg p-8 border border-gray-200 shadow-2xl">
        <h1 className="text-center mb-8 text-3xl font-semibold font-montserrat">
          Shoe Mileage Tracker
        </h1>

        <div className="mb-8 flex justify-center items-center">
          <input
            type="file"
            id="upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="upload"
            className="px-8 py-3 text-lg font-semibold text-white rounded-md cursor-pointer bg-emerald-400 hover:bg-gradient-to-r from-emerald-400 to-emerald-600"
          >
            Choose File
          </label>
        </div>

        <div className="result">
          {selectedImage && (
            <div className="w-full flex justify-center items-center mb-4 animate-fade-in">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded image"
                className="w-full max-w-sm rounded-lg shadow-md"
              />
            </div>
          )}
          {totalMiles !== null && (
            <div className="text-center">
              <p className="text-4xl font-semibold font-montserrat">
                {totalMiles.toFixed(2)} miles
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
