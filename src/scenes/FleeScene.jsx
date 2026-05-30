import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { playFlee } from '../utils/sfx';
import { useSceneExit } from '../hooks/useSceneExit';
import { DEFAULT_HABITAT } from '../utils/constants';
import './FleeScene.css';

export default function FleeScene({ habitat, onDone }) {
  const t = T[useLang()];

  useSceneExit(playFlee, onDone);

  return (
    <div className="flee-scene">
      <div className={`flee-bg habitat-${habitat ?? DEFAULT_HABITAT}`} />
      <div className="char char-walk-back anim-walk-out flee-char" />
      <div className="flee-dialog">{t.fled}</div>
    </div>
  );
}
