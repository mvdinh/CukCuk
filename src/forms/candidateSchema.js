// forms/candidateSchema.js
import {
  required,
  minLength,
  maxLength,
  email,
  phone,
  hasUppercase,
  numberRange,
  pastDate,
} from '../validators/rules';


export const candidateSchema = {
  candidateName: [
    required('Họ và tên'),
    minLength(5, 'Họ và tên phải từ 5 ký tự trở lên'),
    hasUppercase('Họ và tên phải có ít nhất một chữ viết hoa'),
  ],
  email: [
    required('Email'),
    email(),
  ],
  phoneNumber: [
    required('Số điện thoại'),
    phone(),
  ],
  rating: [
    numberRange(0, 10),
  ],
  dateOfBirth: [
    pastDate(),
  ],
  nation: [],
  address: [
    maxLength(200),
  ],
};

/**
 * Cấu hình render form động
 * Thêm field mới chỉ cần thêm vào đây, không sửa component
 */
export const candidateFormFields = [
  {
    key:         'candidateName',
    label:       'Họ và tên *',
    type:        'text',
    placeholder: 'Nhập họ và tên...',
  },
  {
    key:         'email',
    label:       'Email *',
    type:        'email',
    placeholder: 'example@email.com',
  },
  {
    key:         'phoneNumber',
    label:       'Số điện thoại *',
    type:        'text',
    placeholder: '0912 345 678',
  },
  {
    key:         'rating',
    label:       'Điểm đánh giá',
    type:        'number',
    placeholder: '0 - 10',
  },
  {
    key:         'dateOfBirth',
    label:       'Ngày sinh',
    type:        'date',
    placeholder: '',
  },
  {
    key:         'nation',
    label:       'Quốc gia',
    type:        'text',
    placeholder: 'Việt Nam',
  },
  {
    key:         'address',
    label:       'Địa chỉ',
    type:        'text',
    placeholder: 'Số nhà, tên đường...',
  },
];