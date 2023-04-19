const vi = {
  lang:[
    { value: "en", label: "Eng" },
    { value: "vi", label: "Vie" },
  ],
  header: {
    open_navigation : "Open Navigation",
    close_navigation : "Close Navigation",
    theme_switcher: "Theme Switcher",
  },
  footer: {
    about_me: "Tìm hiểu về mình",
    links: [
      // // Format link in Footer
      // {
      //   title: "Example #1",
      //   link: "#",
      // },
    ],
    social_networks: [
      {
        icon: "SiGmail",
        link: "mailto:duyntp2000@gmail.com",
      },
      {
        icon: "SiLinkedin",
        link: "https://www.linkedin.com/in/duyntp2000/",
      },
      {
        icon: "SiGithub",
        link: "https://github.com/howznguyen",
      },
      {
        icon: "SiGitlab",
        link: "https://gitlab.com/howznguyen",
      },
      {
        icon: "SiFacebook",
        link: "https://www.facebook.com/howznguyen",
      },
      
    ],
    develop_by: "Phát triển bởi ",
    build_with: "Xây dựng bằng ",
    with: "bằng ",
  },
  home: {
    intro: {
      header: "Xin chào, Mình là Howz Nguyễn",
      description:
        "Mình hiện tại đang là một Lập Trình Viên Fullstack. Đây là một website mình tạo ra với mong muốn được chia sẻ kiến thức của mình đến với mọi người. Cảm ơn mọi người đã ghé qua. ❤️",
      image: "/assets/images/orion-nebula.jpg",
      links: [
        {
          icon: "HiOutlineNewspaper",
          title: "Resume",
          link: "https://github.com/howznguyen/my-resume/blob/main/pdf/cv_en_vi_howznguyen.pdf",
        },
        {
          icon: "FaFacebook",
          title: "howznguyen",
          link: "https://facebook.com/howznguyen/",
        },
        {
          icon: "FaGithub",
          title: "howznguyen",
          link: "https://github.com/howznguyen",
        },
      ],
    },
    featured_posts: "Bài Viết Đặc Sắc",
    read_more: "Xem thêm",
    categories: [
      {
        name: "Kiến thức",
        description:
          "Các bài viết liên quan về kiến thức lập trình và thuật toán.",
        value: ["code", "algorithm"],
      },
      {
        name: "Tutorial & Tips",
        description:
          "Các bài viết hướng dẫn hoặc mẹo về lập trình và công nghệ.",
        value: ["tutorial", "tip"],
      },
      {
        name: "Notion",
        description:
          "Các bài viết có nội dung về Notion và các tiện ích xung quanh Notion.",
        value: "notion",
      },
      {
        name: "Khác",
        description: "Các bài viết không thuộc chủ đề công nghệ.",
        value: "other",
      },
    ],
  },
  post: {
    published_at_by: (datetime: any, author: any) => {
      return `Được đăng vào ${datetime} bởi ${author}.`;
    },
    reading_time: (min: any) => {
      return `${min} phút đọc`;
    },
    views: (views: any) => {
      return `${views} lượt xem`;
    },
    tags: "Tags",
    relate_post: "Những Bài Viết Liên Quan:",
  },
  blog: {
    blog: "Blog",
    intro: "Ở đây bạn có thể tìm thấy tất cả các bài viết của mình",
    find_posts: "Tìm kiếm bài viết...",
    not_found_post: "Không có bài viết nào",
  },
  tag: {
    tag: "Tag",
    tags: "Tags",
    intro: "Bạn có thể tìm các bài viết theo các tags dưới đây:",
    not_found_post: "Không có bài viết nào",
    post_by_tag: "Các bài viết của tag:",
  },
  error_page: {
    404 : {
      title: "Trang Không Tồn Tại",
      head: "Xin lỗi, mình không thể tìm thấy trang này.",
      desc: "Nhưng đừng lo, bạn có thể tìm thấy nhiều thứ khác trên trang chủ của mình.",
      home_button: "Trang Chủ"
    }
  },
  common: {
    error: "Lỗi",
    is_loading: "Đang tải...",
    process_take_few_second: "Quá trình này có thể mất vài giây, vui lòng không đóng trang này.",
  }
};

export default vi;