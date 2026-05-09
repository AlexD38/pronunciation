import "./style.css";

export const Input = ({ label, value, onChange, onKeyUp, result }) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <input type="text" value={value} onChange={onChange} onKeyUp={onKeyUp} />
      <div className="results-container">
        {result && (
          <>
            {result.ipa && <span className="ipa">💡 {result.ipa}</span>}
            {result.sampa && <span className="sampa">👂 {result.sampa}</span>}
            {result.soundsLike && result.soundsLike.length > 0 && (
              <div className="sounds-like">
                sounds like : {result.soundsLike.slice(0, 5).join(", ")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
