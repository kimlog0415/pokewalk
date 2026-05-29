import './ForkScene.css';

export default function ForkScene({ step }) {
  return (
    <div className="fork-scene">
      <div className="bg-scroll fork-bg" />
      <div className="char char-walk fork-char" />
      <div className="fork-dialog">
        <p>갈림길이다!</p>
        <p className="fork-step">({step + 1} / 4)</p>
      </div>
    </div>
  );
}
