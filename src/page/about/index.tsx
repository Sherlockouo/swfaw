import { Link } from "@nextui-org/react";

const About: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-center items-center">
        
        <Link
          isExternal
          href="https://opto.ca/health-library/the-20-20-20-rule"
          showAnchorIcon
        >
          20-20-20 Rule
        </Link>
      </div>
    </div>
  );
};

export default About;
