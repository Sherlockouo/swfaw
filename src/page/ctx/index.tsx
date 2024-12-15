import { Snippet } from "@nextui-org/snippet";

const Ctx: React.FC = () => {
  const data = {
    snippet: ['ssh-keygen -t ed25519 -C "your_email@example.com"'],
  };
  return (
    <div>
      {data.snippet &&
        data.snippet.map((item, index) => {
          return <Snippet key={index}>{item}</Snippet>;
        })}
    </div>
  );
};
export default Ctx;
