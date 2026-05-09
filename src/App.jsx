import { useState } from "react";
import "./App.css";
import { Input } from "./components/Input";
import { utils } from "./utils/utils";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);

  const handleUpdate = async (value) => {
    setInputValue(value);
    if (!value.trim()) {
      setResult(null);
      return;
    }

    const words = value.trim().split(/\s+/);
    
    const ipa = words
      .map(word => {
        const res = utils.convertToIPA(utils.getPhonemes(word));
        return res ? res.slice(1, -1) : "?";
      })
      .join(" ");

    const sampa = words
      .map(word => {
        const res = utils.convertToSampa(utils.getPhonemes(word));
        return res ? res.slice(1, -1) : "?";
      })
      .join(" ");
    
    setResult(prev => ({ 
      ...prev, 
      ipa: `/${ipa}/`, 
      sampa: `"${sampa}"`, 
      soundsLike: [] 
    }));

    if (words.length === 1) {
      const soundsLike = await utils.getSoundsLike(words[0]);
      setResult(prev => ({ ...prev, soundsLike }));
    } else {
      setResult(prev => ({ ...prev, soundsLike: [] }));
    }
  };

  return (
    <main className="app-container">
      <header>
        <h1>Pronunciation</h1>
        <p className="subtitle">Translate any text into IPA and SAMPA phonetics instantly.</p>
      </header>

      <section className="search-section">
        <Input
          label="Enter word or sentence"
          value={inputValue}
          onChange={(e) => handleUpdate(e.target.value)}
          onKeyUp={(e) => handleUpdate(e.target.value)}
          result={result}
        />
      </section>

      <div className="background-decor">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>
    </main>
  );
}

export default App;
