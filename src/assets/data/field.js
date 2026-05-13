const fieldCandidate = [
  {
    key: "urlAvatar",
    label: "",
    type: "avatar",
  },
  {
    key: "candidateName",
    label: "Họ và tên",
    type: "text",
  },
  {
    key: "phoneNumber",
    label: "Số điện thoại",
    type: "text",
  },
  {
    key: "candidateSource",
    label: "Nguồn",
    type: "text",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
  },
  {
    key: "workPosition",
    label: "Vị trí",
    type: "text",
  },
  {
    key: "rating",
    label: "Đánh giá",
    type: "rating",
  },
  {
    key: "nation",
    label: "Quốc gia",
    type: "text",
  },
  {
    key: "city",
    label: "Thành phố",
    type: "text",
  },
  {
    key: "dateOfBirth",
    label: "Ngày sinh",
    type: "date",
  },
  {
    key: "gender",
    label: "Giới tính",
    type: "custom",
    render: (row) => {
      if (row.gender === 1 || row.gender === "1") return "Nam";
      if (row.gender === 0 || row.gender === "0") return "Nữ";
      return row.gender;
    },
  },
  {
    key: "educationLevel",
    label: "Học vấn",
    type: "text",
  },
];

export default fieldCandidate;
