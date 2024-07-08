interface ILinkContainer {
  title: string;
  links: ILink[];
}

interface ILink {
  label: string;
  link: string;
  target?: string;
  rel?: string;
}

export const footerLinks: ILinkContainer[] = [
  {
    title: "Обо мне",
    links: [
      {
        label: "Мои проекты",
        link: "#",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "Мой блог",
        link: "#",
        target: "_blank",
        rel: "noopener noreferrer",
      },
    ],
  },
  {
    title: "Подписывайтесь на нас",
    links: [
      {
        label: "Github",
        link: "https://github.com/Nayteruz",
        target: "_blank",
      },
      {
        label: "Discord",
        link: "#",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        label: "Privacy policy",
        link: "#",
      },
      {
        label: "Terms & Conditions",
        link: "#",
      },
    ],
  },
];
