export const INTRO_DATA = {
  sourceUrl:
    'https://ts.nlu.edu.vn/ts-44043-1/vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-va-cao-dang-nganh-giao-duc-mam-non-nam-2026-du-kien.html',
  hero: {
    eyebrow: 'Tuyển sinh NLU 2026',
    title: 'Đề án tuyển sinh 2026',
    subtitle: 'Đại học chính quy và cao đẳng ngành Giáo dục Mầm non',
    description:
      'Tóm tắt theo thông tin dự kiến của Trường Đại học Nông Lâm TP.HCM, công bố ngày 15/02/2026.',
  },
  overview: {
    label: 'Tổng quan',
    heading: 'Trường Đại học Nông Lâm TP.HCM',
    paragraphs: [
      '**Trường Đại học Nông Lâm Thành phố Hồ Chí Minh** tuyển sinh trình độ đại học chính quy và cao đẳng ngành Giáo dục Mầm non năm 2026 theo thông tin dự kiến được công bố trên cổng tuyển sinh của Trường.',
      'Trang này gom lại các nội dung thí sinh cần nắm nhanh trước khi tra cứu ngành, chọn tổ hợp và nhập điểm dự đoán: phạm vi tuyển sinh, các phương thức xét tuyển, cách dùng điểm học bạ, chứng chỉ tiếng Anh và kênh liên hệ chính thức.',
      'Thông tin có tính dự kiến. Khi đăng ký xét tuyển chính thức, thí sinh cần đối chiếu đề án, quy chế và các thông báo mới nhất được Trường công khai trên website tuyển sinh.',
    ],
    highlight:
      'Nguồn cập nhật: bài “Thông tin Tuyển sinh đại học chính quy và cao đẳng ngành Giáo dục mầm non năm 2026 (Dự kiến)” trên cổng tuyển sinh NLU.',
    visualInfo: [
      { icon: 'calendar', label: 'Năm tuyển sinh', value: '2026' },
      { icon: 'school', label: 'Bậc đào tạo', value: 'Đại học chính quy và cao đẳng Giáo dục Mầm non' },
      { icon: 'map', label: 'Phạm vi', value: 'Tuyển sinh trên phạm vi toàn quốc' },
      { icon: 'list', label: 'Phương thức', value: '05 nhóm phương thức xét tuyển' },
      { icon: 'book', label: 'Điểm học bạ', value: 'Trung bình 6 học kỳ từ lớp 10 đến lớp 12' },
      { icon: 'public', label: 'Nguồn chính thức', value: 'ts.hcmuaf.edu.vn' },
    ],
  },
  methods: [
    {
      icon: 'award',
      tag: 'Phương thức chung',
      title: 'Tuyển thẳng và ưu tiên xét tuyển',
      description:
        'Thực hiện theo quy chế tuyển sinh của Bộ Giáo dục và Đào tạo.',
      details: [
        'Thí sinh nộp hồ sơ đăng ký xét tuyển theo quy chế hiện hành.',
        'Mốc nhận hồ sơ dự kiến: trước 17 giờ 00 ngày 20/06/2026.',
      ],
    },
    {
      icon: 'activity',
      tag: 'Phương thức 1',
      title: 'Xét điểm Đánh giá năng lực ĐHQG TP.HCM',
      description:
        'Sử dụng kết quả kỳ thi Đánh giá năng lực do Đại học Quốc gia TP.HCM tổ chức năm 2026.',
      details: [
        'Áp dụng cho các ngành theo thông báo tuyển sinh của Trường.',
        'Không sử dụng phương thức này cho ngành Giáo dục Mầm non trình độ cao đẳng, đại học.',
      ],
    },
    {
      icon: 'file',
      tag: 'Phương thức 2',
      title: 'Xét điểm thi tốt nghiệp THPT 2026',
      description:
        'Xét tuyển dựa vào điểm các môn thi tốt nghiệp THPT năm 2026 có trong tổ hợp xét tuyển.',
      details: [
        'Tất cả các ngành xét theo các môn trong tổ hợp xét tuyển.',
        'Riêng Giáo dục Mầm non xét điểm thi Toán, Ngữ văn và điểm thi môn Năng khiếu.',
      ],
    },
    {
      icon: 'combine',
      tag: 'Phương thức 3',
      title: 'Kết hợp điểm THPT và học bạ',
      description:
        'Dùng điểm 02 môn thi tốt nghiệp THPT năm 2026 và 01 môn còn lại trong tổ hợp bằng điểm học bạ.',
      details: [
        'Điểm học bạ là trung bình 6 học kỳ từ học kỳ I lớp 10 đến học kỳ II lớp 12, làm tròn đến hai số lẻ thập phân.',
        'Môn dùng học bạ để bổ sung hoặc thay thế không được là Toán và Ngữ văn.',
        'Không áp dụng cho ngành Giáo dục Mầm non trình độ cao đẳng, đại học.',
      ],
    },
    {
      icon: 'book',
      tag: 'Phương thức 4',
      title: 'Xét học bạ THPT',
      description:
        'Sử dụng điểm học bạ của mỗi môn trong tổ hợp xét tuyển.',
      details: [
        'Điểm mỗi môn là trung bình 6 học kỳ từ lớp 10 đến lớp 12, làm tròn đến hai số lẻ thập phân.',
        'Tại cơ sở Thành phố Hồ Chí Minh, phương thức học bạ chỉ xét thí sinh tốt nghiệp THPT năm 2026.',
      ],
    },
  ],
  notes: {
    label: 'Lưu ý quan trọng',
    heading: 'Các quy định ảnh hưởng trực tiếp đến nhập điểm',
    items: [
      {
        title: 'Chứng chỉ tiếng Anh quốc tế',
        text: 'Với phương thức sử dụng kết quả thi THPT năm 2026, thí sinh có thể dùng IELTS hoặc TOEFL ITP còn giá trị đến ngày làm thủ tục dự thi THPT để quy đổi, bổ sung hoặc thay thế môn Tiếng Anh trong tổ hợp xét tuyển.',
      },
      {
        title: 'Điểm học bạ dùng 6 học kỳ',
        text: 'Các phương thức có dùng học bạ lấy trung bình 6 học kỳ từ học kỳ I lớp 10 đến học kỳ II lớp 12 và làm tròn đến hai chữ số thập phân.',
      },
      {
        title: 'Ràng buộc môn Toán và Ngữ văn',
        text: 'Ở phương thức kết hợp THPT và học bạ, môn được thay thế bằng học bạ không được là Toán và Ngữ văn.',
      },
      {
        title: 'Ngành Giáo dục Mầm non',
        text: 'Ngành Giáo dục Mầm non có quy định riêng về môn Năng khiếu và không áp dụng phương thức Đánh giá năng lực hoặc phương thức kết hợp THPT với học bạ.',
      },
    ],
  },
  englishCertificateConversion: [
    { ielts: '4.5', toeflItp: '450', convertedScore: '8,0' },
    { ielts: '5.0', toeflItp: '480', convertedScore: '8,5' },
    { ielts: '5.5', toeflItp: '500', convertedScore: '9,0' },
    { ielts: '6.0', toeflItp: '530', convertedScore: '9,5' },
    { ielts: '>= 6.5', toeflItp: '>= 550', convertedScore: '10' },
  ],
  additionalInfo: {
    label: 'Thông tin cần thiết khác',
    heading: 'Các thông tin cần biết khi dự tuyển',
    groups: [
      {
        title: 'Các điều kiện phụ sử dụng trong xét tuyển',
        items: [
          'Đối với phương thức xét tuyển sử dụng kết quả thi THPT năm 2026, thí sinh có thể sử dụng điểm chứng chỉ Tiếng Anh quốc tế còn giá trị sử dụng đến ngày làm thủ tục dự thi THPT theo quy định của Bộ Giáo dục và Đào tạo để bổ sung hoặc thay thế môn Tiếng Anh trong tổ hợp xét tuyển.',
          'Điểm bài thi IELTS phải đạt từ 4,5 trở lên; đơn vị cấp chứng chỉ gồm British Council (BC) hoặc International Development Program (IDP).',
          'Điểm bài thi TOEFL ITP phải đạt từ 450 trở lên; đơn vị cấp chứng chỉ Educational Testing Service (ETS).',
        ],
      },
      {
        title: 'Điểm cộng',
        items: [
          'Điểm ưu tiên khu vực và đối tượng thực hiện theo quy chế tuyển sinh hiện hành.',
          'Với phương thức xét tuyển dựa vào kết quả thi Đánh giá năng lực do Đại học Quốc gia Thành phố Hồ Chí Minh tổ chức năm 2026, mức điểm ưu tiên chênh lệch giữa hai nhóm đối tượng liền kề là 40 điểm, mức chênh lệch giữa hai khu vực liền kề là 10 điểm theo thang điểm 1200.',
          'Đối với thí sinh có tổng điểm thi từ 900 điểm trở lên theo thang điểm 1200, điểm ưu tiên được xác định theo công thức: Điểm ưu tiên = [(1200 - tổng điểm đạt được) / 300]. Mức điểm ưu tiên quy định làm tròn đến không số lẻ thập phân.',
        ],
      },
      {
        title: 'Tiêu chí phân ngành, chương trình đào tạo',
        items: [
          'Áp dụng theo thông tin tuyển sinh và quy định của cơ sở đào tạo đối với các trường hợp tuyển sinh theo nhóm ngành.',
        ],
      },
      {
        title: 'Tổ chức tuyển sinh',
        items: [
          'Thực hiện theo kế hoạch chung của Bộ Giáo dục và Đào tạo.',
          'Kỳ thi môn Năng khiếu phục vụ xét tuyển vào ngành Giáo dục Mầm non trình độ cao đẳng, đại học được tổ chức tại Phân hiệu Trường Đại học Nông Lâm Thành phố Hồ Chí Minh tại Ninh Thuận, dự kiến vào ngày 17 tháng 6 năm 2026.',
          'Thí sinh có thể sử dụng kết quả thi môn Năng khiếu do Trường Đại học Sư phạm Thành phố Hồ Chí Minh hoặc Trường Đại học Sư phạm Hà Nội tổ chức để đăng ký xét tuyển vào ngành Giáo dục Mầm non trình độ đại học và cao đẳng tại Trường Đại học Nông Lâm Thành phố Hồ Chí Minh, theo quy định tuyển sinh hiện hành.',
        ],
      },
      {
        title: 'Chính sách ưu tiên',
        items: [
          'Xét tuyển thẳng và ưu tiên xét tuyển được thực hiện theo quy định của Bộ Giáo dục và Đào tạo.',
        ],
      },
      {
        title: 'Lệ phí xét tuyển, thi tuyển',
        items: [
          'Lệ phí đăng ký xét tuyển thực hiện theo quy định của Bộ Giáo dục và Đào tạo.',
          'Lệ phí dự thi môn Năng khiếu dùng để xét tuyển ngành Giáo dục Mầm non trình độ đại học, cao đẳng là 300.000 đồng.',
        ],
      },
      {
        title: 'Cam kết đối với thí sinh',
        items: [
          'Trường Đại học Nông Lâm Thành phố Hồ Chí Minh đảm bảo quyền lợi của thí sinh dựa trên quy định của Bộ Giáo dục và Đào tạo, bao gồm giải quyết khiếu nại, bảo vệ quyền lợi chính đáng của thí sinh trong các trường hợp rủi ro và trách nhiệm giải quyết việc thí sinh được chuyển đến hoặc chuyển đi do sai sót trong tuyển sinh.',
        ],
      },
    ],
  },
  contact: {
    label: 'Liên hệ tuyển sinh',
    heading: 'Kênh thông tin chính thức',
    description:
      'Thí sinh nên theo dõi cổng tuyển sinh của Trường để cập nhật đề án, ngưỡng đầu vào, thời gian đăng ký và các thông báo điều chỉnh.',
    rows: [
      { icon: 'location', label: 'Địa chỉ', value: 'Ban Tuyển sinh, Phòng G01 Nhà Thiên Lý, KP 33, Phường Linh Trung, TP. Hồ Chí Minh' },
      { icon: 'phone', label: 'Điện thoại', value: '028 3896 3350 hoặc 028 3897 4716' },
      { icon: 'mail', label: 'Email', value: 'pdaotao@hcmuaf.edu.vn' },
      { icon: 'public', label: 'Website', value: 'ts.hcmuaf.edu.vn' },
    ],
  },
} as const;
