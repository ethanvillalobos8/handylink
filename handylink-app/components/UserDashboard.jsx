import SearchBar from '@/components/SearchBar';
import ServiceCard from '@/components/ServiceCard';

export default function UserDashboard() {
    return (
        <section className="grid my-6">
            <h1 className="text-4xl font-bold text-center my-6 flex justify-center items-center">
                <span className="flex w-max text-gradient bg-gradient-to-r from-custom-primary to-custom-accent">
                    Welcome
                </span>
                &nbsp;- Service Page &#40;<span className="italic" style={{ WebkitTextStroke: "1px #13040c", color: "transparent", }}>&nbsp;HOME&nbsp;&nbsp;</span>&#41;
            </h1>
            <SearchBar />
            <p className="text-md mt-12 mb-4 text-custom-text text-left text-xl font-semibold">All services</p>
            <ServiceCard />
        </section>
    );
}