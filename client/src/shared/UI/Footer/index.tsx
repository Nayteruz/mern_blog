import { Footer as FooterFlowbite } from "flowbite-react";
import { Logo } from "../Logo";
import { BsGitlab, BsGithub, BsYoutube } from "react-icons/bs";

export const Footer = () => {
  return (
    <FooterFlowbite container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5 ">
            <Logo className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3">
            <div>
              <FooterFlowbite.Title title="About" />
              <FooterFlowbite.LinkGroup col>
                <FooterFlowbite.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Мои проекты
                </FooterFlowbite.Link>
                <FooterFlowbite.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog
                </FooterFlowbite.Link>
              </FooterFlowbite.LinkGroup>
            </div>
            <div>
              <FooterFlowbite.Title title="Follow us" />
              <FooterFlowbite.LinkGroup col>
                <FooterFlowbite.Link
                  href="https://github.com/Nayteruz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </FooterFlowbite.Link>
                <FooterFlowbite.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </FooterFlowbite.Link>
              </FooterFlowbite.LinkGroup>
            </div>
            <div>
              <FooterFlowbite.Title title="Legal" />
              <FooterFlowbite.LinkGroup col>
                <FooterFlowbite.Link href="#">
                  Privacy policy
                </FooterFlowbite.Link>
                <FooterFlowbite.Link href="#">
                  Terms &amp; Conditions
                </FooterFlowbite.Link>
              </FooterFlowbite.LinkGroup>
            </div>
          </div>
        </div>
        <FooterFlowbite.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterFlowbite.Copyright
            href="#"
            by="Alex's Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <FooterFlowbite.Icon href="#" icon={BsGitlab} />
            <FooterFlowbite.Icon
              href="https://github.com/Nayteruz"
              icon={BsGithub}
            />
            <FooterFlowbite.Icon href="#" icon={BsYoutube} />
          </div>
        </div>
      </div>
    </FooterFlowbite>
  );
};
