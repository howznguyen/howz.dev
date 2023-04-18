const en = {
  lang:[
    { value: "en", label: "English" },
    { value: "vi", label: "Tiếng Việt" },
  ],
  header: {
    open_navigation : "Open Navigation",
    close_navigation : "Close Navigation",
    theme_switcher: "Theme Switcher",
  },
  footer: {
    about_me: "About me",
    links: [
      // // Format link in Footer
      // {
      //   title: "Example #1",
      //   link: "#",
      // },
    ],
    social_networks: [
      {
        title: "Mail",
        icon: "SiGmail",
        link: "mailto:duyntp2000@gmail.com",
      },
      {
        title: "Linkedin",
        icon: "SiLinkedin",
        link: "https://www.linkedin.com/in/duyntp2000/",
      },
      {
        title: "Github",
        icon: "SiGithub",
        link: "https://github.com/howznguyen",
      },
      {
        title: "Gitlab",
        icon: "SiGitlab",
        link: "https://gitlab.com/howznguyen",
      },
      {
        title: "Facebook",
        icon: "SiFacebook",
        link: "https://www.facebook.com/howznguyen",
      },
      
    ]
  },
  home: {
    intro: {
      header: "Hi, I'm Howz Nguyen",
      description:
        "I am currently a Fullstack Developer. This is a website I created with the desire to share my knowledge to everyone. Thank you to everyone who visited. ❤️",
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
    featured_posts: "Featured Posts",
    read_more: "Read more",
    categories: [
      {
        name: "Knowledge",
        description:
          "Related posts about programming knowledge and algorithms.",
        value: ["code", "algorithm"],
      },
      {
        name: "Tutorial & Tips",
        description: "Tutorials or tips about programming and technology.",
        value: ["tutorial", "tip"],
      },
      {
        name: "Notion",
        description:
          "Articles with content about Notion and utilities around Notion.",
        value: "notion",
      },
      {
        name: "Other",
        description: "The posts are not related to technology topics.",
        value: "other",
      },
    ],
  },
  post: {
    published_at_by: (datetime: any, author: any) => {
      return `Published at ${datetime} by ${author}.`;
    },
    reading_time: (min: any) => {
      return `${min} min read`;
    },
    views: (views: any) => {
      return `${views} views`;
    },
    tags: "Tags",
    relate_post: "Realted Posts:",
  },
  blog: {
    blog: "Blog",
    description: "Here you can find all my posts",
    intro: "Here you can find all my posts",
    find_posts: "Posts search...",
    not_found_post: "There are no posts yet",
  },
  tag: {
    tags: "Tags",
    intro: "You can find articles under the tags below:",
    not_found_post: "There are no posts yet",
    post_by_tag: "Posts by tag:",
  }
};

export default en;