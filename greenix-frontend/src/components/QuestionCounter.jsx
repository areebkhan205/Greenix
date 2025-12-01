function QuestionCounter({ current, total }) {
  return (
    <div className="bg-white px-6 py-2 rounded-md shadow-md font-bold border-2 border-black">
      PREGUNTA {current}/{total}
    </div>
  );
}
export default QuestionCounter;
