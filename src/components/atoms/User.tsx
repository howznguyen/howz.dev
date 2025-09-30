import Image from "next/image";
import LinkAtoms from "./Link";
import slugify from "slugify";
import cn from "classnames";
import { generateAuthorSlug } from "@/lib/author-utils";
import Icon from "./Icon";

interface User {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
}

interface UserProps {
  user: User;
  size?: "inline" | "section";
  hideAvatar?: boolean;
  className?: string;
}

interface UsersProps {
  users: User[];
  size?: "inline" | "section";
  className?: string;
  hideAvatar?: boolean;
}

export function User({
  user,
  size = "inline",
  className = "",
  hideAvatar = false,
}: UserProps) {
  const { name, avatar } = user;

  const slugUser = generateAuthorSlug(user);
  const urlUser = `/u/${slugUser}`;
  switch (size) {
    case "inline":
      return (
        <LinkAtoms href={urlUser}>
          <div className={cn("inline-flex", "items-center gap-1.5", className)}>
            {!hideAvatar && avatar && (
              <Image
                src={avatar}
                alt={name || "User"}
                width={16}
                height={16}
                className="rounded-full"
              />
            )}
            <span className="text-sm">
              <span>{name}</span>
              {user.verified && (
                <Icon icon="PiSealCheckFill" className="ml-1 inline-block" />
              )}
            </span>
          </div>
        </LinkAtoms>
      );
    case "section":
      return (
        <div key={user.id} className="flex items-center gap-3">
          {!hideAvatar && user.avatar && (
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <LinkAtoms
              href={urlUser}
              className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span>{user.name}</span>
              {user.verified && (
                <Icon icon="PiSealCheckFill" className="w-4 h-4 inline-block" />
              )}
            </LinkAtoms>
            <div>Content Writer</div>
          </div>
        </div>
      );
  }
}

export const Users = ({
  users,
  size = "inline",
  className = "",
  hideAvatar = false,
}: UsersProps) => {
  switch (size) {
    case "inline":
      return (
        <div className={cn("flex", "flex-wrap", "gap-2", className)}>
          {users.map((user) => (
            <User
              key={user.id}
              user={user}
              size={size}
              hideAvatar={hideAvatar}
            />
          ))}
        </div>
      );
    case "section":
      return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {users.length === 1 ? "Author" : "Authors"}
          </h3>
          <div className="flex flex-wrap gap-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <User
                  key={user.id}
                  user={user}
                  size={size}
                  hideAvatar={hideAvatar}
                />
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};
