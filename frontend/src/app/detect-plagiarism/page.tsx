"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function DetectPlagiarism() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [cosineSimilarity, setCosineSimilarity] = useState<number | null>(null);

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile1(file);
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile2(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1 || !file2) {
      toast.warning("Harap unggah kedua file kode terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect-plagiarism/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Terjadi kesalahan saat memproses file");
        throw new Error("Terjadi kesalahan saat memproses file");
      }

      const data = await res.json();
      setCosineSimilarity(data.cosine_similarity_percentage);
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengirim permintaan");
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl justify-center items-center w-full">
      <div className="flex flex-col rounded-2xl justify-center items-center w-1/2 p-8 bg-gray-800/90 card shadow-xl">
        <h1 className="text-2xl font-bold">Deteksi Plagiarisme Kode Program</h1>

        <form onSubmit={handleSubmit} className="mt-5 w-full">
          <div className="flex justify-between items-center gap-5 w-full">
            <div>
              <label htmlFor="file1" className="text-blue-100">
                Pilih File Kode Asli:
              </label>
              <input
                type="file"
                id="file1"
                onChange={handleFile1Change}
                className="file-input file-input-bordered file-input-info w-full max-w-xs"
              />
            </div>

            <div className="text-right">
              <label htmlFor="file2" className="text-red-100">
                Pilih File Kode yang Mencurigakan:
              </label>
              <input
                type="file"
                id="file2"
                onChange={handleFile2Change}
                className="file-input file-input-bordered file-input-error w-full max-w-xs"
              />
            </div>
          </div>

          <div className="w-full flex justify-center mt-5">
            <button type="submit" className="btn">
              Periksa Plagiarisme
            </button>
          </div>
        </form>
      </div>

      {cosineSimilarity !== null && (
        <div className="flex flex-col rounded-2xl justify-center items-center w-1/3 p-8 bg-gray-800/90 card shadow-xl">
          <h2 className="text-xl font-semibold mb-5">Hasil Deteksi Plagiarisme</h2>
          <div className="flex justify-around items-center w-full">
            <div className="">
              <p>Cosine Similarity</p>
              <p>Hasil</p>
            </div>
            <div className="">
              <p>: {cosineSimilarity}%</p>
              <p>: {result}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
