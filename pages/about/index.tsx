import { useQuery } from "react-query";
import { NotionRenderer } from "react-notion";
import "react-notion/src/styles.css";

const getAbout = async () => {
    return (
        await fetch("api/page/shotclock-9ebbc7b285f84acf80c2a961e989ec31")
    ).json();
};

const About = () => {
    const { data } = useQuery(["getAbout"], getAbout);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <NotionRenderer blockMap={data.body} />
        </div>
    );
};
export default About;