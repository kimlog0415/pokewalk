import './BattleScene.css';

export default function BattleScene({ pokemon, round }) {
  return (
    <div className="battle-scene">
      <div className="battle-bg" />
      <div className="char char-walk battle-char" />
      {pokemon && (
        <div className="battle-pokemon">
          <img src={pokemon.sprite} alt={pokemon.name} width={112} height={112} />
          <div className="battle-pokemon-name">{pokemon.name}</div>
        </div>
      )}
      <div className="battle-dialog">
        {round === 0
          ? '가위바위보로 승부!'
          : `${round}번째 시도... 다시!`}
      </div>
    </div>
  );
}
