import { useState, useEffect } from "react";
import "./App.css";
import { Input } from "./components/Input";
import { utils } from "./utils/utils";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  // Au chargement, on vérifie s'il y a un mot dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      handleUpdate(query);
    }
  }, []);

  const handleUpdate = async (value) => {
    setInputValue(value);
    
    const url = new URL(window.location);
    if (value.trim()) {
      url.searchParams.set("q", value);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url);

    if (!value.trim()) {
      setResult(null);
      setToast(null);
      return;
    }

    const words = value.trim().split(/\s+/);
    
    // On prépare les phonèmes (localement ou fallback via API)
    // NOTE: Le fallback API est conservé ici pour la fluidité de la transcription
    const phonemesPromises = words.map(async (word) => {
      let ph = utils.getPhonemes(word);
      if (ph === "?") {
        ph = await utils.getArpabetFallback(word);
      }
      return ph;
    });

    const resolvedPhonemes = await Promise.all(phonemesPromises);

    const ipa = resolvedPhonemes
      .map(ph => {
        const res = utils.convertToIPA(ph);
        return res ? res.slice(1, -1) : "?";
      })
      .join(" ");

    const sampa = resolvedPhonemes
      .map(ph => {
        const res = utils.convertToSampa(ph);
        return res ? res.slice(1, -1) : "?";
      })
      .join(" ");
    
    setResult(prev => ({ 
      ...prev, 
      ipa: `/${ipa}/`, 
      sampa: `"${sampa}"`, 
      soundsLike: prev?.soundsLike || [] 
    }));
  };

  // Effet pour gérer le "debounce" des appels API lourds et de la notification
  useEffect(() => {
    if (!inputValue.trim()) return;

    const timer = setTimeout(async () => {
      const words = inputValue.trim().split(/\s+/);
      
      if (words.length === 1) {
        const soundsLike = await utils.getSoundsLike(words[0]);
        const definition = await utils.getDefinition(words[0]);
        
        // C'est une faute d'orthographe si l'API a trouvé un mot différent de l'input
        const isMisspelled = definition && definition.word && definition.word.toLowerCase() !== words[0].toLowerCase();
        
        setResult(prev => ({ 
          ...prev, 
          soundsLike,
          suggestion: isMisspelled ? definition.word : null
        }));
        
        // On n'affiche le toast que si le mot est exactement celui tapé
        if (definition && definition.defs && !isMisspelled) {
          const rawDef = definition.defs.split("\t")[1] || definition.defs;
          const shortDef = rawDef.split(".")[0] + ".";
          
          setToast({ 
            word: definition.word.toUpperCase(),
            text: shortDef, 
            pos: definition.pos?.[0] 
          });
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Effet pour faire disparaître le toast automatiquement après 5s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToHistory = (value) => {
    if (!value.trim()) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item !== value.trim());
      return [value.trim(), ...filtered].slice(0, 4);
    });
  };

  return (
    <main className="app-container">
      {toast && (
        <div className="toast">
          {toast.pos && <span className="toast-pos">{toast.pos}</span>}
          <p><strong>{toast.word}</strong>: {toast.text}</p>
        </div>
      )}
      <header className={inputValue ? "focus-mode" : ""}>
        <h1>Pronunciation</h1>
        <p className="subtitle">Translate any text into IPA and SAMPA phonetics instantly.</p>
      </header>

      <section className="search-section">
        <Input
          label="Enter word or sentence"
          value={inputValue}
          onChange={(e) => handleUpdate(e.target.value)}
          onKeyUp={(e) => handleUpdate(e.target.value)}
          onSpeak={() => addToHistory(inputValue)}
          result={result}
        />
      </section>

      {history.length > 0 && (
        <div className="history-container">
          {history.map((item, index) => (
            <button 
              key={index} 
              className="history-chip"
              onClick={() => handleUpdate(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className="background-decor">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>
    </main>
  );
}

export default App;
