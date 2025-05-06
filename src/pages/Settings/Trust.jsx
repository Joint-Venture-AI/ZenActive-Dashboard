import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../Components/PageHeading";
import { FaAngleLeft } from "react-icons/fa6";
import { useGetAboutQuery } from "../../redux/features/setting/settingApi";
import parse from "html-react-parser";

const Trust = () => {
    const navigate = useNavigate();
    const { data: about } = useGetAboutQuery()
    const handleBackButtonClick = () => {
        navigate(-1); // This takes the user back to the previous page
    };
    return (
        <>
            <div className="flex items-center gap-2 text-xl cursor-pointer" onClick={handleBackButtonClick}>
                <FaAngleLeft />
                <h1 className="">About us</h1>
            </div>
            <div className="rounded-lg py-4 border-lightGray border-2 shadow-lg mt-8 bg-white">
                <div className="space-y-[24px] min-h-[83vh] bg-light-gray rounded-2xl">
                    <h3 className="text-2xl text-[#174C6B] mb-4 border-b-2 border-lightGray/40 pb-3 pl-16">
                        About us
                    </h3>
                    <div className="w-full px-16">

                        <div className="space-y-5 text-black text-sm">
                            <h1>{about?.data?.about ? parse(about?.data?.about) : "Loading..."}</h1>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={(e) => navigate(`edit`)}
                                size="large"
                                type="primary"
                                className="px-8 h-12 bg-[#174C6B] text-white hover:bg-black/90 rounded-full font-semibold w-1/4"
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Trust;
