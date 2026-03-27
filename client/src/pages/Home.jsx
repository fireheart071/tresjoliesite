import { Hero } from "../components/Hero";
import { Categories } from "../components/Categories";
import { Featured } from "../components/Featured";

export const Home = () => {
    return (
        <>
            <Hero />
            <Categories />
            <Featured />
        </>
    );
};