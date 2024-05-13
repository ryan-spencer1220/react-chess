import "./Tile.css";

interface Props {
  image: string;
  color: string;
}

const Tile = ({ color, image }: Props) => {
  return (
    <div className={`square ${color}`}>
      {image && <div style={{ backgroundImage: `url(${image})` }} className="chess-piece"></div>}
    </div>
  );
};

export default Tile;
