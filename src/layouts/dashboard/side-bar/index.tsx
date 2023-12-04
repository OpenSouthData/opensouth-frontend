import { Link, NavLink } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { IoGridOutline } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";
import Logo from "~/components/logo";
import Button from "~/components/button";
import useAppStore from "~/store/app";
import OrgDropdown from "./org-dropdown";

export default function SideBar() {
  const { setDisplayLogoutModal } = useAppStore();

  function navLinkClassNameHandler({
    isActive,
  }: {
    isActive: boolean;
    isPending: boolean;
  }): string {
    return `flex items-center gap-4 p-4 transition-all border-primary-800 ${
      isActive && "border-l-[3px] bg-primary-50"
    }`;
  }

  return (
    <aside className="tabletAndBelow:!hidden bg-background border-r border-grey min-h-screen flex flex-col w-[250px] sticky top-0 left-0 overflow-y-auto h-screen">
      <Link to="/" className="flex justify-center items-center w-full py-8">
        <Logo />
      </Link>
      <div className="h-[100%] overflow-auto flex flex-col gap-8 justify-between pb-10">
        <div>
          <NavLink to={"/account/dashboard"} className={navLinkClassNameHandler}>
            <IoGridOutline />
            <p className="text-sm">Dashboard</p>
          </NavLink>
          <NavLink to={"/account/datasets"} className={navLinkClassNameHandler}>
            <GoDatabase />
            <p className="text-sm">Datasets</p>
          </NavLink>
          <div className="py-4">
            <p className="flex items-center px-8 py-2 text-sm font-medium">Organizations</p>
            <div className="flex flex-col">
              {[
                {
                  name: "Netflix",
                  slug: "netflix",
                },
              ].map((item, index) => (
                <OrgDropdown key={index + 1} {...item} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            className="!w-fit"
            startIcon={<IoLogOutOutline />}
            onClick={() => {
              setDisplayLogoutModal(true);
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </aside>
  );
}
