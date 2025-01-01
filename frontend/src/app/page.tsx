import DetectPlagiarism from "./detect-plagiarism/page";

export default function Home() {
  return (
    <div
      className="flex flex-col justify-start items-center w-full h-screen bg-white text-white"
      style={{
        backgroundImage: "url('background1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "100vh",
      }}>
      <div className="w-screen h-screen flex justify-center items-center">
        <DetectPlagiarism />
      </div>
    </div>
  );
}
