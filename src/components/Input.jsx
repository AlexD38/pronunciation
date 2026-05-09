import "./style.css";
import { utils } from "../utils/utils";

export const Input = ({ label, value, onChange, onKeyUp, onSpeak, result }) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <div className="input-wrapper">
        <input type="text" value={value} onChange={onChange} onKeyUp={onKeyUp} />
        {value && (
          <button 
            className="audio-button" 
            onClick={() => {
              utils.speak(value);
              onSpeak?.();
            }}
            title="Listen to pronunciation"
          >
            🔊
          </button>
        )}
      </div>
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
