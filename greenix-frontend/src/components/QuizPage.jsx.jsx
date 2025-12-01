import QuizBox from "./QuizBox";

export default function QuizPage() {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center overflow-hidden"
    >
    

      {/* centered quiz box */}
      <div className="relative bottom-[100px] z-10 w-full h-full grid place-items-center p-4">
        <QuizBox />
      </div>
    </div>
  );
}
