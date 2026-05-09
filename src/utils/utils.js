import { dictionary } from "cmu-pronouncing-dictionary";

const arpaToIPA = {
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  EH: "ɛ",
  ER: "ɝ",
  EY: "eɪ",
  F: "f",
  G: "ɡ",
  HH: "h",
  IH: "ɪ",
  IY: "i",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  OW: "oʊ",
  OY: "ɔɪ",
  P: "p",
  R: "ɹ",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  UH: "ʊ",
  UW: "u",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

const arpaToSampa = {
  AA: "a",
  AE: "ae",
  AH: "a",
  AO: "o",
  AW: "aw",
  AY: "ay",
  B: "b",
  CH: "ch",
  D: "d",
  DH: "dh",
  EH: "e",
  ER: "er",
  EY: "ey",
  F: "f",
  G: "g",
  HH: "h",
  IH: "i",
  IY: "iy",
  JH: "jh",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ng",
  OW: "ow",
  OY: "oy",
  P: "p",
  R: "r",
  S: "s",
  SH: "sh",
  T: "t",
  TH: "th",
  UH: "u",
  UW: "uw",
  V: "v",
  W: "w",
  Y: "y",
  Z: "z",
  ZH: "zh",
};

export const utils = {
  getPhonemes(word) {
    const phonemes = dictionary[word.toLowerCase()];
    return phonemes || "?"; // retourne '?' si non trouvé
  },
  // Convertit un mot ARPAbet en IPA en gardant le stress
  convertToIPA(arpabet) {
    if (!arpabet || arpabet == "?") {
      return null;
    }

    const symbols = arpabet.trim().split(/\s+/);

    let ipa = "";
    for (let i = 0; i < symbols.length; i++) {
      const match = symbols[i].match(/^([A-Z]+)(\d)?$/);
      if (!match) continue;

      const [_, base, stress] = match;
      const ipaSymbol = arpaToIPA[base] || base;

      // En ARPAbet :
      // 1 = primary stress → ˈ
      // 2 = secondary stress → ˌ
      // 0 = none
      if (stress === "1") {
        ipa += "ˈ" + ipaSymbol; // accent tonique
      } else if (stress === "2") {
        ipa += "ˌ" + ipaSymbol; // accent secondaire
      } else {
        ipa += ipaSymbol;
      }
    }

    return "/" + ipa + "/";
  },

  // Convertit un mot ARPAbet en une version lisible (Sampa-like)
  convertToSampa(arpabet) {
    if (!arpabet || arpabet == "?") {
      return null;
    }

    const symbols = arpabet.trim().split(/\s+/);

    let sampa = "";
    for (let i = 0; i < symbols.length; i++) {
      const match = symbols[i].match(/^([A-Z]+)(\d)?$/);
      if (!match) continue;

      const [_, base, stress] = match;
      const sampaSymbol = arpaToSampa[base] || base;

      // En ARPAbet :
      // 1 = primary stress → '
      // 2 = secondary stress → ,
      // 0 = none
      if (stress === "1") {
        sampa += "'" + sampaSymbol; // accent tonique
      } else if (stress === "2") {
        sampa += "," + sampaSymbol; // accent secondaire
      } else {
        sampa += sampaSymbol;
      }
    }

    return `"${sampa}"`;
  },

  async getSoundsLike(word) {
    try {
      const response = await fetch(
        `https://api.datamuse.com/words?max=11&sl=${word}`
      );
      const data = await response.json();
      return data.map(item => item.word);
    } catch (error) {
      console.error("Error fetching similar sounding words:", error);
      return [];
    }
  }
};
