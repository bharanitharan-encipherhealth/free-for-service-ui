import Image from "next/image";
import { Avatar } from "antd";

export const getBackgroundColor = (randomNumber) => {
  switch (randomNumber) {
    case 1:
      return "#F28585";
    case 2:
      return "#04306F";
    case 3:
      return "var(--app-table-secondary3)";
    case 4:
      return "#558e95";
    case 5:
      return "#DED0B6";
    case 6:
      return "#C3E2C2";
    default:
      return "#9BB8CD";
  }
};
export const renderUserPrfoileAvatar = (
  firstName,
  lastName,
  imageUrl,
  field,
  customBg
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";
  const hash = (firstNameInitial.charCodeAt(0) % 6) + 1;
  const backgroundColor = customBg
    ? "#93BEFB"
    : field
    ? getBackgroundColor(hash)
    : "#F3C217";

  if (!imageUrl) {
    const profileAvatar = (
      <Avatar
        style={{
          backgroundColor: backgroundColor,
          color: "var(--defaultColor)",
        }}
        className={`cursor-pointer flex content-between items-center text-sm font-medium w-6 h-6`}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    const profileAvatar = (
      <image
        src={imageUrl}
        alt="avatar"
        width={30}
        height={30}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        }}
        priority
        fetchPriority="high"
      />
    );
    return profileAvatar;
  }
};
