import { Table } from "antd";
import exlamIcon from "../../../assets/images/exclamation-circle.png";
import { Link } from "react-router-dom";

const Support = () => {
   const columns = [
      {
        title: "#SL",
        dataIndex: "transIs",
        key: "transIs",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "Email",
        key: "Email",
      },
      {
        title: "Phone Number",
        key: "Phone",
        dataIndex: "Phone",
      },
      {
        title: "Action",
        key: "Review",
        aligen: 'center',
        render: (_, data) => (
          <Link to='/support-chat' className="  items-center justify-around textcenter flex " >
            {/* Review Icon */}
            <img src={exlamIcon} alt="" className="btn  px-3 py-1 text-sm rounded-full cursor-pointer" onClick={() => showModal(data)} />
            {/* <Link to={'/reviews'} className="btn bg-black text-white px-3 py-1 text-sm rounded-full">
                   
                    View
                  </Link> */}
          </Link>
        ),
      },
    ];
  
    const data = [];
    for (let index = 0; index < 20; index++) {
      data.push({
        transIs: `${index + 1}`,
        name: "Henry",
        Email: "sharif@gmail.com",
        Phone: "+12746478994",
        Review: "See Review",
        date: "16 Apr 2024",
        _id: index,
      });
    }
  return (
    <div className="rounded-lg border py-4 border-black mt-8 recent-users-table">
      <h3 className="text-2xl text-black mb-4 pl-2">Support</h3>
      {/* Ant Design Table */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"] }}
        className="rounded-lg"
      />

     
    </div>
  )
}

export default Support
